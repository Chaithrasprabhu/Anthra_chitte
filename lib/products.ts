import type { Product } from "@/lib/data";
import { getProductByIdFromDB, getProductsFromDB } from "@/lib/db/products";

export type ProductWithFabric = Product & { fabric?: string };

export async function getProductById(id: string): Promise<ProductWithFabric | undefined> {
  const product = await getProductByIdFromDB(id);
  if (!product) return undefined;

  return {
    id: product.id,
    name: product.name,
    category: product.category as Product["category"],
    price: product.price,
    image: product.image,
    description: product.description,
    fabric: product.fabric,
    isNew: product.isNew,
    rating: product.rating,
    reviewCount: product.reviewCount,
    discountPercent: product.discountPercent,
  };
}

export function isFabricProduct(product: ProductWithFabric): boolean {
  return "fabric" in product && !!product.fabric;
}

export function isPurseProduct(product: ProductWithFabric): boolean {
  return product.category === "Purse";
}

export { getProductsFromDB };
