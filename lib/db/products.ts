import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Rating } from "@/models/Rating";

export interface DbProduct {
  id: string;
  name: string;
  category: string;
  fabric?: string;
  price: number;
  image: string;
  description: string;
  isNew?: boolean;
  rating?: number;
  reviewCount?: number;
  discountPercent?: number;
  source: "fabric" | "catalog" | "handmade";
}

async function getRatingForProduct(productId: string): Promise<{ rating: number; reviewCount: number }> {
  const agg = await Rating.aggregate([
    { $match: { productId } },
    { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  if (agg[0]) {
    return {
      rating: Math.round(agg[0].avgRating * 10) / 10,
      reviewCount: agg[0].count,
    };
  }
  return { rating: 0, reviewCount: 0 };
}

export async function getProductsFromDB(filters?: {
  fabric?: string;
  isNew?: boolean;
  source?: "fabric" | "catalog" | "handmade";
  category?: string;
}): Promise<DbProduct[]> {
  await connectDB();
  const query: Record<string, unknown> = {};
  if (filters?.fabric) query.fabric = filters.fabric;
  if (filters?.isNew === true) query.isNew = true;
  if (filters?.source) query.source = filters.source;
  if (filters?.category) query.category = filters.category;

  const products = await Product.find(query).lean();
  const result: DbProduct[] = [];

  for (const p of products) {
    const fromRatings = await getRatingForProduct(p.id);
    result.push({
      id: p.id,
      name: p.name,
      category: p.category,
      fabric: p.fabric,
      price: p.price,
      image: p.image,
      description: p.description,
      isNew: p.isNew,
      rating: fromRatings.reviewCount > 0 ? fromRatings.rating : (p.rating ?? 4.5),
      reviewCount: fromRatings.reviewCount > 0 ? fromRatings.reviewCount : (p.reviewCount ?? 0),
      discountPercent: p.discountPercent,
      source: p.source,
    });
  }
  return result;
}

export async function getProductByIdFromDB(id: string): Promise<DbProduct | null> {
  await connectDB();
  const product = await Product.findOne({ id }).lean();
  if (!product) return null;

  const fromRatings = await getRatingForProduct(product.id);
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    fabric: product.fabric,
    price: product.price,
    image: product.image,
    description: product.description,
    isNew: product.isNew,
    rating: fromRatings.reviewCount > 0 ? fromRatings.rating : (product.rating ?? 4.5),
    reviewCount: fromRatings.reviewCount > 0 ? fromRatings.reviewCount : (product.reviewCount ?? 0),
    discountPercent: product.discountPercent,
    source: product.source,
  };
}
