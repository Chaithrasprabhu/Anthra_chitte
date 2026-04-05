"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PriceDisplay } from "@/components/PriceDisplay";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";

type PurseProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  discountPercent?: number;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
};

export default function HandmadeEssentialsPage() {
  const [products, setProducts] = useState<PurseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addFavorite, removeFavorite, isFavorite } = useCartStore();

  useEffect(() => {
    fetch("/api/products?category=Purse")
      .then((res) => (res.ok ? res.json() : []))
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-purse-card]");
    const w = card?.offsetWidth ?? 320;
    el.scrollBy({ left: dir * (w + 24), behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground sm:text-5xl">
            Handmade Essentials
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Curated handcrafted pieces—starting with our velvet potli collection.
          </p>
        </div>

        <section aria-labelledby="purse-heading" className="space-y-8">
          <h2 id="purse-heading" className="text-2xl font-serif font-semibold text-foreground text-center">
            Purse
          </h2>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
              <p className="text-xl text-muted-foreground">No products in this category yet.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Mobile: horizontal snap carousel — same card style as Linen Digital Prints */}
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                className="md:hidden absolute left-0 top-[28%] z-10 -translate-y-1/2 rounded-full bg-background/90 border border-border p-2 shadow-md hover:bg-background"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                className="md:hidden absolute right-0 top-[28%] z-10 -translate-y-1/2 rounded-full bg-background/90 border border-border p-2 shadow-md hover:bg-background"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div
                ref={scrollRef}
                className={cn(
                  "flex md:grid gap-6 md:gap-x-6 md:gap-y-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                  "overflow-x-auto snap-x snap-mandatory md:overflow-visible md:snap-none",
                  "pb-2 -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth"
                )}
              >
                {products.map((product) => (
                  <div
                    key={product.id}
                    data-purse-card
                    className="group relative border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-all duration-300 shrink-0 snap-center w-[min(calc(100vw-3rem),380px)] md:w-auto"
                  >
                    <Link
                      href={`/product/${product.id}`}
                      className="block aspect-[3/4] w-full overflow-hidden bg-gray-100 relative"
                    >
                      <div className="absolute top-2 left-2 z-10 flex gap-1.5 flex-wrap">
                        {product.isNew && (
                          <span className="rounded-md bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white shadow">
                            NEW
                          </span>
                        )}
                        {product.discountPercent != null && product.discountPercent > 0 && (
                          <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white shadow">
                            {Math.round(product.discountPercent)}% OFF
                          </span>
                        )}
                      </div>
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 85vw, 50vw"
                      />
                      <div className="absolute top-2 right-2 z-10">
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
                                category: "Purse",
                                price: product.price,
                                image: product.image,
                                description: product.description,
                                discountPercent: product.discountPercent,
                              });
                          }}
                          aria-label={
                            isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"
                          }
                        >
                          <Heart
                            className={cn("h-5 w-5", isFavorite(product.id) && "fill-current")}
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
                      <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
                        <PriceDisplay
                          price={product.price}
                          discountPercent={product.discountPercent}
                          variant="default"
                        />
                        <Button size="sm" variant="secondary" className="font-medium" asChild>
                          <Link href={`/product/${product.id}`}>Add to Cart</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
