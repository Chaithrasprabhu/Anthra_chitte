import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Rating } from "@/models/Rating";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const fabric = searchParams.get("fabric");
    const isNew = searchParams.get("isNew");
    const category = searchParams.get("category");

    let query: Record<string, unknown> = {};
    if (fabric) query.fabric = fabric;
    if (isNew === "true") query.isNew = true;
    if (category) query.category = category;

    const products = await Product.find(query).lean();

    // Aggregate ratings from Rating collection for each product
    const productIds = products.map((p) => p.id);
    const ratingAgg = await Rating.aggregate([
      { $match: { productId: { $in: productIds } } },
      {
        $group: {
          _id: "$productId",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);
    const ratingMap = Object.fromEntries(
      ratingAgg.map((r) => [r._id, { rating: Math.round(r.avgRating * 10) / 10, reviewCount: r.count }])
    );

    const result = products.map((p) => {
      const fromDb = ratingMap[p.id];
      return {
        ...p,
        _id: undefined,
        rating: fromDb?.rating ?? p.rating ?? 4.5,
        reviewCount: fromDb?.reviewCount ?? p.reviewCount ?? 0,
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("API /products error:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
