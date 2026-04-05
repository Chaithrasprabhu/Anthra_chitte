"use client";

import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/PriceDisplay";
import { ProductRatingBlock } from "@/components/ProductRatingBlock";
import { useCartStore } from "@/store/useCartStore";
import type { ProductWithFabric } from "@/lib/products";
import type { Product } from "@/lib/data";
import { Heart, Info, ShoppingCart } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface HandmadeProductDetailsProps {
  product: ProductWithFabric;
}

export function HandmadeProductDetails({ product }: HandmadeProductDetailsProps) {
  const { addItem, addFavorite, removeFavorite, isFavorite } = useCartStore();

  const handleAddToCart = () => {
    const productForCart: Product = {
      id: product.id,
      name: product.name,
      category: "Purse",
      price: product.price,
      image: product.image,
      description: product.description,
      discountPercent: product.discountPercent,
      rating: product.rating,
      reviewCount: product.reviewCount,
    };
    addItem(productForCart);
  };

  const handleWishlist = () => {
    const item: Product = {
      id: product.id,
      name: product.name,
      category: "Purse",
      price: product.price,
      image: product.image,
      description: product.description,
      discountPercent: product.discountPercent,
      rating: product.rating,
      reviewCount: product.reviewCount,
    };
    if (isFavorite(product.id)) removeFavorite(product.id);
    else addFavorite(item);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-serif text-primary">{product.name}</h1>
        <ProductRatingBlock
          productId={product.id}
          rating={product.rating ?? 4.5}
          reviewCount={product.reviewCount ?? 0}
          size="lg"
        />
        <PriceDisplay
          price={product.price}
          discountPercent={product.discountPercent}
          className="text-xl [&_p:last-child]:text-primary [&_span:last-child]:text-primary"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          size="lg"
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-lg gap-2"
          onClick={handleAddToCart}
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
          <Heart className={`w-6 h-6 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : ""}`} />
        </Button>
      </div>

      <Separator />

      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        <p>{product.description}</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Handmade velvet with gold lace &amp; zari detail</li>
          <li>Beaded handle and drawstring with tassels</li>
          <li>Ideal for weddings, festivals &amp; gifting</li>
        </ul>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border/50">
        <Info className="w-4 h-4 shrink-0" />
        <span>Free shipping on orders above ₹2000. Easy returns within 5 days (wrong/damaged item only).</span>
      </div>
    </div>
  );
}
