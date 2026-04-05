"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/PriceDisplay";
import { StarRating } from "@/components/StarRating";
import { Heart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

const categories = [
  { id: "dailywear", label: "Linen Digital Prints" },
  { id: "mysore crepe", label: "Mysore crape" },
  { id: "ganga pattu", label: "Ganga Pattu" },
];

type FabricItem = {
  id: string;
  name: string;
  fabric: string;
  price: number;
  image: string;
  description: string;
  isNew?: boolean;
  rating?: number;
  reviewCount?: number;
  discountPercent?: number;
  mrp?: number;
};

function discountOffPercent(p: FabricItem): number | undefined {
  if (p.mrp != null && p.mrp > p.price) {
    return Math.round(((p.mrp - p.price) / p.mrp) * 100);
  }
  return p.discountPercent;
}

export default function SareesByFabricPage() {
  const [selectedFabric, setSelectedFabric] = useState("dailywear");
  const [products, setProducts] = useState<FabricItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addFavorite, removeFavorite, isFavorite } = useCartStore();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/products?fabric=" + encodeURIComponent(selectedFabric));
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
  }, [selectedFabric]);

  const filteredSarees = products.filter((s) => s.fabric === selectedFabric);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            Shop Sarees by Fabric
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collection of sarees sorted by fabric type.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedFabric === category.id ? "default" : "outline"}
              className={cn(
                "rounded-full px-6",
                selectedFabric === category.id && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              onClick={() => setSelectedFabric(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
            <p className="text-xl text-destructive">{error}</p>
          </div>
        ) : filteredSarees.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {filteredSarees.map((product) => {
              const off = discountOffPercent(product);
              return (
              <div
                key={product.id}
                className="group relative border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-all duration-300"
              >
                <Link
                  href={`/product/${product.id}`}
                  className="block aspect-[3/4] w-full overflow-hidden bg-gray-100 relative"
                >
                  <div className="absolute top-2 left-2 z-10 flex gap-1.5">
                    {product.isNew && (
                      <span className="rounded-md bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white shadow">
                        NEW
                      </span>
                    )}
                    {off != null && off > 0 && (
                      <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white shadow">
                        {off}% OFF
                      </span>
                    )}
                  </div>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
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
                            category: "Sarees",
                            price: product.price,
                            image: product.image,
                            description: product.description,
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
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <PriceDisplay
                      price={product.price}
                      discountPercent={product.discountPercent}
                      mrp={product.mrp}
                      variant="default"
                    />
                    <Button size="sm" variant="secondary" className="font-medium" asChild>
                      <Link href={`/product/${product.id}`}>Add to Cart</Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
            <p className="text-xl text-muted-foreground">No products found in this category.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
