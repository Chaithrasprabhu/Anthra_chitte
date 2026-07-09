/** Client-safe product helpers — no database or Mongoose imports. */

/** All Mysore crape sarees are currently unavailable for purchase. */
export function isProductSoldOut(product: { fabric?: string }): boolean {
  return product.fabric === "mysore crepe";
}
