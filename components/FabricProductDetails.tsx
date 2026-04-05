"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/PriceDisplay";
import { ProductRatingBlock } from "@/components/ProductRatingBlock";
import { ShoppingCart, Heart, Info } from "lucide-react";
import { useCartStore, READYMADE_ADDON, POCKETS_ADDON } from "@/store/useCartStore";
import type { ProductWithFabric } from "@/lib/products";
import type { Product } from "@/lib/data";
import { Separator } from "@/components/ui/separator";

interface FabricProductDetailsProps {
  product: ProductWithFabric;
}

const sizes = ["XS", "S", "M", "L", "XL"];
const skirtLengths = [
  { value: "free" as const, label: "Free Size" },
  { value: "42" as const, label: "42 inch" },
  { value: "40" as const, label: "40 inch" },
  { value: "38" as const, label: "38 inch" },
  { value: "36" as const, label: "36 inch" },
];

export function FabricProductDetails({ product }: FabricProductDetailsProps) {
  const { addItem, addFavorite, removeFavorite, isFavorite } = useCartStore();
  const [sareeType, setSareeType] = useState<"normal" | "readymade">("normal");
  const [size, setSize] = useState<string>("");
  const [skirtLength, setSkirtLength] = useState<"free" | "42" | "40" | "38" | "36" | "">("");
  const [pockets, setPockets] = useState<"with" | "without" | undefined>(undefined);
  const [palluType, setPalluType] = useState<"open" | "pleated" | undefined>(undefined);
  const [palluLength, setPalluLength] = useState<string>("");
  const [palluWidth, setPalluWidth] = useState<string>("");

  const handleConfirm = () => {
    if (sareeType === "readymade") {
      if (!size || !skirtLength || !pockets || !palluType) return;
      if (palluType === "pleated" && (!palluLength || !palluWidth)) return;
    }

    const readymadeAddon = sareeType === "readymade" ? READYMADE_ADDON : 0;
    const pocketsAddon = pockets === "with" ? POCKETS_ADDON : 0;

    const productForCart: Product = {
      id: product.id,
      name: product.name,
      category: "Sarees",
      price: product.price,
      image: product.image,
      description: product.description,
    };

    addItem(
      productForCart,
      sareeType === "readymade" ? size : undefined,
      {
        sareeType,
        size: sareeType === "readymade" ? (size as "XS" | "S" | "M" | "L" | "XL") : undefined,
        skirtLength: sareeType === "readymade" ? (skirtLength as "free" | "42" | "40" | "38" | "36") : undefined,
        pockets: sareeType === "readymade" ? pockets : undefined,
        palluType: sareeType === "readymade" ? palluType : undefined,
        palluLength: palluType === "pleated" ? (palluLength as "32" | "37" | "42") : undefined,
        palluWidth: palluType === "pleated" ? (palluWidth as "3" | "5" | "7") : undefined,
        readymadeAddon: readymadeAddon || undefined,
        pocketsAddon: pocketsAddon || undefined,
      }
    );
  };

  const canConfirm =
    sareeType === "normal" ||
    (sareeType === "readymade" &&
      size &&
      skirtLength &&
      pockets &&
      palluType &&
      (palluType !== "pleated" || (palluLength && palluWidth)));

  const handleWishlist = () => {
    const item = {
      id: product.id,
      name: product.name,
      category: "Sarees" as const,
      price: product.price,
      image: product.image,
      description: product.description,
    };
    if (isFavorite(product.id)) removeFavorite(product.id);
    else addFavorite(item);
  };

  const optionBtn = (
    isSelected: boolean,
    label: string,
    onClick: () => void,
    className = ""
  ) => (
    <Button
      key={label}
      variant={isSelected ? "default" : "outline"}
      onClick={onClick}
      className={`shrink-0 ${
        isSelected
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "border-muted-foreground/30 text-foreground hover:border-primary hover:text-primary"
      } ${className}`}
    >
      {label}
    </Button>
  );

  const circularBtn = (value: string, label: string, selected: boolean, onClick: () => void) => (
    <Button
      key={value}
      variant="outline"
      onClick={onClick}
      className={`w-12 h-12 rounded-full shrink-0 ${
        selected
          ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
          : "border-muted-foreground/30 text-foreground hover:border-primary hover:text-primary"
      }`}
    >
      {label}
    </Button>
  );

  return (
    <div className="flex flex-col space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-serif text-primary">
          {product.fabric === "dailywear" ? "Linen Digital Prints" : product.fabric} Saree
        </h1>
        <ProductRatingBlock
          productId={product.id}
          rating={product.rating ?? 4.5}
          reviewCount={product.reviewCount ?? 0}
          size="lg"
        />
        <div className="flex items-center gap-2 flex-wrap">
          <PriceDisplay price={product.price} discountPercent={product.discountPercent} className="text-xl [&_p:last-child]:text-primary [&_span:last-child]:text-primary" />
          {product.discountPercent != null && product.discountPercent > 0 && (
            <span className="text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>
        {product.fabric && product.fabric !== "dailywear" && (
          <p className="text-sm text-muted-foreground">
            Fabric: {product.fabric}
          </p>
        )}
      </div>

      <div className="space-y-6 border-t border-border pt-6">
        <h3 className="text-sm font-medium text-foreground">Saree Type</h3>
        <div className="flex flex-wrap gap-2">
          {optionBtn(sareeType === "normal", "Normal Saree", () => setSareeType("normal"))}
          {optionBtn(sareeType === "readymade", "Readymade Saree", () => setSareeType("readymade"))}
        </div>
      </div>

      {sareeType === "readymade" && (
        <>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Size</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) =>
                circularBtn(s, s, size === s, () => setSize(s))
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Saree skirt length</h3>
            <p className="text-xs text-muted-foreground">Free size or customized</p>
            <div className="flex flex-wrap gap-2">
              {skirtLengths.map(({ value }) =>
                circularBtn(
                  value,
                  value === "free" ? "Free" : value,
                  skirtLength === value,
                  () => setSkirtLength(value)
                )
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Pockets</h3>
            <div className="flex flex-wrap gap-2">
              {optionBtn(pockets === "with", "With Pockets", () => setPockets("with"))}
              {optionBtn(pockets === "without", "Without Pockets", () => setPockets("without"))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Pallu</h3>
            <div className="flex flex-wrap gap-2">
              {optionBtn(palluType === "open", "Open Pallu", () => setPalluType("open"))}
              {optionBtn(palluType === "pleated", "Pleated Pallu", () => setPalluType("pleated"))}
            </div>
          </div>

          {palluType === "pleated" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foreground">Pallu Length</h3>
                <div className="flex flex-wrap gap-2">
                  {["32", "37", "42"].map((len) =>
                    optionBtn(
                      palluLength === len,
                      `${len} inch`,
                      () => setPalluLength(len),
                      "rounded-full"
                    )
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foreground">Pallu Width</h3>
                <div className="flex flex-wrap gap-2">
                  {["3", "5", "7"].map((w) =>
                    optionBtn(
                      palluWidth === w,
                      `${w} inch`,
                      () => setPalluWidth(w),
                      "rounded-full"
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {sareeType === "readymade" && (
        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
          <h3 className="text-sm font-medium text-foreground">Price summary</h3>
          <div className="text-sm space-y-1">
            <p className="flex justify-between">
              <span className="text-muted-foreground">Base price</span>
              <span>₹{product.price.toLocaleString("en-IN")}</span>
            </p>
            {sareeType === "readymade" && (
              <p className="flex justify-between">
                <span className="text-muted-foreground">Readymade saree</span>
                <span>+₹{READYMADE_ADDON}</span>
              </p>
            )}
            {pockets === "with" && (
              <p className="flex justify-between">
                <span className="text-muted-foreground">With pockets</span>
                <span>+₹{POCKETS_ADDON}</span>
              </p>
            )}
            <p className="flex justify-between font-semibold pt-2 border-t border-border">
              <span>Total (per piece)</span>
              <span className="text-primary">
                ₹{(product.price + (sareeType === "readymade" ? READYMADE_ADDON : 0) + (pockets === "with" ? POCKETS_ADDON : 0)).toLocaleString("en-IN")}
              </span>
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          size="lg"
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-lg gap-2"
          onClick={handleConfirm}
          disabled={!canConfirm}
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full shrink-0 border-muted-foreground/30 text-muted-foreground hover:text-red-500 hover:border-red-500"
          onClick={handleWishlist}
        >
          <Heart
            className={`w-6 h-6 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : ""}`}
          />
        </Button>
      </div>

      <Separator />

      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        <p>{product.description}</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Handcrafted with care</li>
          <li>Premium breathable fabric</li>
          <li>Perfect for all-day comfort</li>
          <li>Featuring deep pockets (readymade option)</li>
        </ul>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border/50">
        <Info className="w-4 h-4 shrink-0" />
        <span>Free shipping on orders above ₹2000. Easy returns within 5 days(wrong/damaged item only).</span>
      </div>
    </div>
  );
}
