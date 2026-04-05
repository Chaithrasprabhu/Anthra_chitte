"use client";

import { useState } from "react";
import { Product } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/PriceDisplay";
import { ProductRatingBlock } from "@/components/ProductRatingBlock";
import { useCartStore } from "@/store/useCartStore";
import { Heart, Info, Ruler } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ProductDetailsProps {
    product: Product;
}

const sizes = ["XS", "S", "M", "L", "XL", "Free Size"];

export function ProductDetails({ product }: ProductDetailsProps) {
    const [selectedSize, setSelectedSize] = useState<string | undefined>();
    const { addItem, addFavorite, removeFavorite, isFavorite } = useCartStore();

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Please select a size");
            return;
        }
        addItem(product, selectedSize);
    };

    const handleWishlist = () => {
        if (isFavorite(product.id)) removeFavorite(product.id);
        else addFavorite(product);
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
                <PriceDisplay price={product.price} className="text-xl [&_p:last-child]:text-primary [&_span:last-child]:text-primary" />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-foreground">Select Size (Flexifit™)</h3>
                    <Button variant="link" className="text-xs text-muted-foreground p-0 h-auto hover:text-primary">
                        <Ruler className="w-3 h-3 mr-1" /> Size Guide
                    </Button>
                </div>
                <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => (
                        <Button
                            key={size}
                            variant={selectedSize === size ? "default" : "outline"}
                            onClick={() => setSelectedSize(size)}
                            className={`w-12 h-12 rounded-full shrink-0 ${
                                selectedSize === size
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "border-muted-foreground/30 text-foreground hover:border-primary hover:text-primary"
                            }`}
                        >
                            {size}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-lg"
                >
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
                    <li>Handcrafted with care</li>
                    <li>Premium breathable fabric</li>
                    <li>Perfect for all-day comfort</li>
                    {product.category === "Maternity" && <li>Nursing-friendly access</li>}
                    {(product.category === "Sarees" || product.category === "Maternity") && <li>Featuring deep pockets</li>}
                </ul>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border/50">
                <Info className="w-4 h-4 shrink-0" />
                <span>Free shipping on orders above ₹2000. Easy returns within 5 days(wrong/damaged item only).</span>
            </div>
        </div>
    );
}
