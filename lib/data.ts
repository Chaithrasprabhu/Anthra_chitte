import { getProductsFromDB } from "@/lib/db/products";

export interface Product {
  id: string;
  name: string;
  category: "Maternity" | "Infants" | "Sarees" | "Accessories" | "Purse";
  price: number;
  image: string;
  description: string;
  isNew?: boolean;
  rating?: number;
  reviewCount?: number;
  discountPercent?: number;
  /** Maximum retail price (strikethrough) when the sale price is `price`. */
  mrp?: number;
  /** Extra gallery images (e.g. Mysore crepe carousel); primary thumbnail remains `image`. */
  images?: string[];
}

export async function getProducts(): Promise<Product[]> {
  const dbProducts = await getProductsFromDB({ source: "catalog" });
  return dbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category as Product["category"],
    price: p.price,
    image: p.image,
    description: p.description,
    isNew: p.isNew,
    rating: p.rating,
    reviewCount: p.reviewCount,
  }));
}

export async function getAllProductIds(): Promise<string[]> {
  const { getProductsFromDB } = await import("@/lib/db/products");
  const all = await getProductsFromDB();
  return all.map((p) => p.id);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const { getProductByIdFromDB } = await import("@/lib/db/products");
  const product = await getProductByIdFromDB(id);
  if (!product || product.source !== "catalog") return undefined;
  return {
    id: product.id,
    name: product.name,
    category: product.category as Product["category"],
    price: product.price,
    image: product.image,
    description: product.description,
    isNew: product.isNew,
    rating: product.rating,
    reviewCount: product.reviewCount,
  };
}
