"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Product } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem, addFavorite, removeFavorite, isFavorite } = useCartStore();
    const liked = isFavorite(product.id);

    return (
        <div className="group relative flex flex-col space-y-3">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 sm:aspect-[4/5] shadow-sm transition-shadow hover:shadow-md">
                {/* Image with Hover Zoom */}
                <Link href={`/product/${product.id}`} className="block h-full w-full">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    />
                </Link>

                {/* Badges */}
                {product.isNew && (
                    <span className="absolute left-2 top-2 bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        New
                    </span>
                )}

                {/* Quick Actions Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0 flex gap-2 justify-center bg-gradient-to-t from-black/60 to-transparent pt-10">
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            addItem(product);
                        }}
                        size="sm"
                        className="w-full bg-white text-primary hover:bg-primary hover:text-white transition-colors border-none shadow-md"
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                    </Button>
                </div>

                {/* Wishlist Button */}
                <Button
                    variant={liked ? "secondary" : "ghost"}
                    size="icon"
                    className="absolute right-2 top-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:text-red-500 hover:bg-white transition-colors opacity-0 group-hover:opacity-100 duration-300"
                    onClick={(e) => {
                        e.preventDefault();
                        if (liked) {
                            removeFavorite(product.id);
                        } else {
                            addFavorite(product);
                        }
                    }}
                >
                    <Heart className="w-5 h-5" />
                    <span className="sr-only">Add to Wishlist</span>
                </Button>
            </div>

            <div className="flex flex-col space-y-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-base font-medium text-foreground">
                            <Link href={`/product/${product.id}`}>
                                <span aria-hidden="true" className="absolute inset-0" />
                                {product.name}
                            </Link>
                        </h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <p className="text-base font-bold text-primary">₹{product.price.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}
