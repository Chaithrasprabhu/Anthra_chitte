/**
 * Removes Jaipuri cotton products and their ratings from MongoDB.
 * Run: npm run remove-jaipuri
 *
 * Requires MONGODB_URI (via lib/mongodb or .env.local if you switch this file to dotenv).
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

  const jaipuriFilter = {
    $or: [{ fabric: "jaipuri cotton" }, { id: { $regex: /^jaipur-/ } }],
  };

  const productRes = await Product.deleteMany(jaipuriFilter);
  console.log(`Deleted ${productRes.deletedCount} product(s) (Jaipuri cotton).`);

  const ratingRes = await Rating.deleteMany({ productId: { $regex: /^jaipur-/ } });
  console.log(`Deleted ${ratingRes.deletedCount} rating document(s) for Jaipuri products.`);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
