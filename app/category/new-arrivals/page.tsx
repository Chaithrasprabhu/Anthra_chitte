"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/PriceDisplay";
import { StarRating } from "@/components/StarRating";
import { Heart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { SoldOutImageOverlay } from "@/components/SoldOutImageOverlay";
import { isProductSoldOut } from "@/lib/product-utils";
import { cn } from "@/lib/utils";

type FabricItem = {
  id: string;
  name: string;
  fabric?: string;
  price: number;
  image: string;
  description: string;
  isNew?: boolean;
  rating?: number;
  reviewCount?: number;
  discountPercent?: number;
  mrp?: number;
};

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<FabricItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addFavorite, removeFavorite, isFavorite } = useCartStore();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/products?isNew=true");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProducts(data);
      } catch (e) {
        setError("Failed to load products. Please try again.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            New Arrivals
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our latest additions across Mysore crepe and handmade essentials.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
            <p className="text-xl text-destructive">{error}</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {products.map((product) => {
              const soldOut = isProductSoldOut(product);
              return (
              <div
                key={product.id}
                className="group relative border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-all duration-300"
              >
                <Link
                  href={`/product/${product.id}`}
                  className="block aspect-[3/4] w-full overflow-hidden bg-gray-100 relative"
                >
                  <div className="absolute top-2 left-2 z-20 flex flex-wrap gap-1.5">
                    {!soldOut && (
                    <span className="rounded-md bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white shadow">
                      NEW
                    </span>
                    )}
                    {!soldOut && product.discountPercent != null && product.discountPercent > 0 && (
                      <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white shadow">
                        {product.discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className={cn(
                      "h-full w-full object-cover object-center transition-transform duration-500",
                      !soldOut && "group-hover:scale-105"
                    )}
                  />
                  <SoldOutImageOverlay soldOut={soldOut} />
                  <div className="absolute top-2 right-2 z-20">
                    <Button
                      variant={isFavorite(product.id) ? "secondary" : "ghost"}
                      size="icon"
                      className="rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:text-red-500 hover:bg-white transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isFavorite(product.id)) removeFavorite(product.id);
                        else
                          addFavorite({
                            id: product.id,
                            name: product.name,
                            category: "Sarees",
                            price: product.price,
                            image: product.image,
                            description: product.description,
                          });
                      }}
                      aria-label={
                        isFavorite(product.id)
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      <Heart
                        className={`h-5 w-5 ${isFavorite(product.id) ? "fill-current" : ""}`}
                      />
                    </Button>
                  </div>
                </Link>
                <div className="p-4 flex flex-col gap-2">
                  <StarRating
                    rating={product.rating ?? 4.5}
                    reviewCount={product.reviewCount}
                    size="sm"
                  />
                  <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                    {product.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <PriceDisplay
                      price={product.price}
                      discountPercent={product.discountPercent}
                      mrp={product.mrp}
                      variant="default"
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      className="font-medium"
                      disabled={soldOut}
                      asChild={!soldOut}
                    >
                      {soldOut ? (
                        <span>Sold Out</span>
                      ) : (
                        <Link href={`/product/${product.id}`}>Add to Cart</Link>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
            <p className="text-xl text-muted-foreground">
              No new arrivals at the moment. Check back soon!
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
