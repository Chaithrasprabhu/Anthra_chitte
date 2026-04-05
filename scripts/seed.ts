/**
 * Seed script: npm run seed
 * Requires MONGODB_URI in .env.local (or set DOTENV_CONFIG_PATH=.env.local)
 */
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import * as fs from "fs";
import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://anthrachitte_db_user:wESQWeDIXtVDoCAi@ecom.8vrh2ca.mongodb.net/anthrachitte";
if (!MONGODB_URI) {
  console.error("MONGODB_URI not set. Create .env.local with MONGODB_URI.");
  process.exit(1);
}

async function seed() {
  await mongoose.connect(MONGODB_URI);

  const productSchema = new mongoose.Schema(
    {
      id: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      category: { type: String, required: true },
      fabric: { type: String },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      description: { type: String, required: true },
      isNew: { type: Boolean, default: false },
      rating: { type: Number },
      reviewCount: { type: Number },
      discountPercent: { type: Number },
      mrp: { type: Number },
      images: [{ type: String }],
      source: { type: String, enum: ["fabric", "catalog", "handmade"], required: true },
    },
    { timestamps: true }
  );
  const Product = mongoose.models.Product ?? mongoose.model("Product", productSchema);

  // Clear existing products
  await Product.deleteMany({});

  // Seed fabric sarees
  const fabricPath = path.join(process.cwd(), "lib", "fabric-sarees.json");
  const fabricData = JSON.parse(fs.readFileSync(fabricPath, "utf-8"));
  const fabricProducts = fabricData.map((p: Record<string, unknown>) => ({
    id: p.id,
    name: p.name,
    category: "Sarees",
    fabric: p.fabric,
    price: p.price,
    image: p.image,
    description: p.description,
    isNew: p.isNew ?? false,
    rating: p.rating,
    reviewCount: p.reviewCount,
    discountPercent: p.discountPercent,
    mrp: p.mrp,
    images: p.images,
    source: "fabric",
  }));
  await Product.insertMany(fabricProducts);
  console.log(`Seeded ${fabricProducts.length} fabric products`);

  // Seed catalog products
  const catalogProducts = [
    { id: "1", name: "Infant Cotton Set", category: "Infants", price: 1299, image: "https://placehold.co/600x400.png?text=Infant+Set", description: "Soft organic cotton set for infants, perfect for sensitive skin.", rating: 4.9, reviewCount: 56, source: "catalog" },
    { id: "2", name: "Handwoven Silk Stole", category: "Accessories", price: 1899, image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=2487&auto=format&fit=crop", description: "Luxurious handwoven silk stole to complement any outfit.", rating: 4.7, reviewCount: 24, source: "catalog" },
    { id: "3", name: "Nursing Friendly Anarkali", category: "Maternity", price: 3200, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=2534&auto=format&fit=crop", description: "Elegant Anarkali suit with discreet nursing access.", rating: 4.5, reviewCount: 31, source: "catalog" },
    { id: "4", name: "Temple Border Saree", category: "Sarees", price: 5500, image: "https://placehold.co/600x400.png?text=Temple+Border+Saree", description: "Classic temple border saree in deep teal and gold.", rating: 4.4, reviewCount: 19, source: "catalog" },
  ];
  await Product.insertMany(catalogProducts);
  console.log(`Seeded ${catalogProducts.length} catalog products`);

  const handmadePath = path.join(process.cwd(), "lib", "handmade-purse.json");
  const handmadeData = JSON.parse(fs.readFileSync(handmadePath, "utf-8"));
  const handmadeProducts = handmadeData.map((p: Record<string, unknown>) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    image: p.image,
    description: p.description,
    isNew: p.isNew ?? false,
    rating: p.rating,
    reviewCount: p.reviewCount,
    discountPercent: p.discountPercent,
    source: "handmade",
  }));
  await Product.insertMany(handmadeProducts);
  console.log(`Seeded ${handmadeProducts.length} handmade products`);

  console.log("Seed complete.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
