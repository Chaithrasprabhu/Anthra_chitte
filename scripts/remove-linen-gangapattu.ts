/**
 * Removes Linen Digital Prints (dailywear) and Ganga Pattu products + their ratings from MongoDB.
 * Run: npm run remove-linen-gangapattu
 */
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });
dotenv.config();

import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Rating } from "@/models/Rating";

async function main() {
  await connectDB();

  const productFilter = {
    $or: [
      { fabric: "dailywear" },
      { fabric: "ganga pattu" },
      { id: { $regex: /^dailywear-/ } },
      { id: { $regex: /^gangapattu-/ } },
    ],
  };

  const toDelete = await Product.find(productFilter).select("id").lean();
  const ids = toDelete.map((p) => p.id);

  const productRes = await Product.deleteMany(productFilter);
  console.log(
    `Deleted ${productRes.deletedCount} product(s) (Linen Digital Prints + Ganga Pattu).`
  );

  if (ids.length > 0) {
    const ratingRes = await Rating.deleteMany({ productId: { $in: ids } });
    console.log(`Deleted ${ratingRes.deletedCount} rating document(s) for those products.`);
  } else {
    console.log("No matching products found; skipped rating cleanup.");
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
