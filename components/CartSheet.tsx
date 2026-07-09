"use client";

import Link from "next/link";
import { useCartStore, getSareeItemPrice, READYMADE_ADDON, POCKETS_ADDON, PLATFORM_FEE, cartItemKey } from "@/store/useCartStore";
import { isBoutiqueCartItem } from "@/lib/boutique-options";
import { useAuthStore } from "@/store/useAuthStore";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/PriceDisplay";
import { ShoppingBag, X, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

export function CartSheet() {
    const { items, removeItem, updateQuantity, subtotalPrice, platformFee, totalPrice, totalItems } = useCartStore();
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const hydrateFromCookie = useAuthStore((s) => s.hydrateFromCookie);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        hydrateFromCookie();
        setMounted(true);
    }, [hydrateFromCookie]);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="relative text-foreground">
                <ShoppingBag className="w-6 h-6" />
            </Button>
        )
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-foreground">
                    <ShoppingBag className="w-6 h-6" />
                    {items.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {totalItems()}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-background border-l-border">
                <SheetHeader>
                    <SheetTitle className="font-serif text-2xl text-primary">Shopping Cart</SheetTitle>
                </SheetHeader>
                <Separator className="my-4" />

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 space-y-4">
                        <ShoppingBag className="w-16 h-16 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground text-lg">Your cart is empty</p>
                        <Button asChild variant="outline" className="mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                            <Link href="/">Continue Shopping</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto pr-4">
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={cartItemKey(item)} className="flex space-x-4">
                                        <div className="relative w-20 h-24 rounded-md overflow-hidden bg-muted">
                                            <Image
                                                src={item.image}
                                                alt={isBoutiqueCartItem(item.id) ? "Custom stitching" : item.id.includes("-") ? "Saree" : item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h4 className="font-medium text-foreground text-sm line-clamp-2">
                                                {isBoutiqueCartItem(item.id) ? item.name : item.id.includes("-") ? "Saree" : item.name}
                                            </h4>
                                            <p className="text-sm text-muted-foreground font-serif">Category: {item.category}</p>
                                            {item.boutiqueConfig && (
                                                <p className="text-xs text-muted-foreground line-clamp-4">
                                                    {item.description}
                                                </p>
                                            )}
                                            {item.size && (
                                                <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                                            )}
                                            {item.config && (
                                                <div className="text-xs text-muted-foreground space-y-0.5">
                                                    <p>Type: {item.config.sareeType}</p>
                                                    {item.config.skirtLength && (
                                                        <p>Skirt length: {item.config.skirtLength === "free" ? "Free size" : `${item.config.skirtLength} inch`}</p>
                                                    )}
                                                    {item.config.pockets && <p>Pockets: {item.config.pockets}</p>}
                                                    {item.config.palluType && <p>Pallu: {item.config.palluType}</p>}
                                                    {item.config.palluType === "pleated" && item.config.palluLength && item.config.palluWidth && (
                                                        <p>Pallu Size: {item.config.palluLength} x {item.config.palluWidth} inch</p>
                                                    )}
                                                    {(item.config.readymadeAddon || item.config.pocketsAddon) ? (
                                                        <div className="pt-1 space-y-0.5 text-foreground">
                                                            <p>Base: ₹{item.price.toLocaleString()} × {item.quantity}</p>
                                                            {item.config.readymadeAddon ? (
                                                                <p>Readymade: +₹{READYMADE_ADDON} × {item.quantity}</p>
                                                            ) : null}
                                                            {item.config.pocketsAddon ? (
                                                                <p>With pockets: +₹{POCKETS_ADDON} × {item.quantity}</p>
                                                            ) : null}
                                                            <p className="font-medium">Total: ₹{(getSareeItemPrice(item) * item.quantity).toLocaleString()}</p>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center space-x-2 border rounded-md">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-none"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.config, item.boutiqueConfig)}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </Button>
                                                    <span className="text-sm w-4 text-center">{item.quantity}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-none"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.config, item.boutiqueConfig)}
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                                {(item.config?.readymadeAddon || item.config?.pocketsAddon) ? (
                                                    <span className="font-semibold">₹{(getSareeItemPrice(item) * item.quantity).toLocaleString()}</span>
                                                ) : (
                                                    <PriceDisplay price={getSareeItemPrice(item)} quantity={item.quantity} discountPercent={item.discountPercent} variant="compact" />
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-destructive self-start -mt-2 -mr-2"
                                            onClick={() => removeItem(item.id, item.size, item.config, item.boutiqueConfig)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="space-y-4 mb-4">
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>₹{subtotalPrice().toLocaleString()}</span>
                                </div>
                                {platformFee() > 0 && (
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Shipping fee (orders under ₹2,000)</span>
                                        <span>+₹{PLATFORM_FEE}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold text-foreground pt-2 border-t border-border">
                                <span>Total</span>
                                <span>₹{totalPrice().toLocaleString()}</span>
                            </div>
                            {isLoggedIn ? (
                                <Button asChild className="w-full btn-primary text-lg py-6 shadow-md hover:shadow-lg transition-all">
                                    <Link href="/checkout">
                                        Proceed to Checkout
                                    </Link>
                                </Button>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-sm text-muted-foreground">Log in or sign up to checkout</p>
                                    <div className="flex gap-2">
                                        <Button asChild variant="outline" className="flex-1">
                                            <Link href="/login?redirect=/checkout">Log in</Link>
                                        </Button>
                                        <Button asChild className="flex-1">
                                            <Link href="/register?redirect=/checkout">Sign up</Link>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
