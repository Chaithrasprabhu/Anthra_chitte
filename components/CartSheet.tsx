"use client";

import { useCartStore } from "@/store/useCartStore";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag, X, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

export function CartSheet() {
    const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration error
    useEffect(() => {
        setMounted(true);
    }, []);

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
                        <Button variant="outline" className="mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                            Continue Shopping
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto pr-4">
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={`${item.id}-${item.size || 'nosize'}`} className="flex space-x-4">
                                        <div className="relative w-20 h-24 rounded-md overflow-hidden bg-muted">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h4 className="font-medium text-foreground text-sm line-clamp-2">{item.name}</h4>
                                            <p className="text-sm text-muted-foreground font-serif">Category: {item.category}</p>
                                            {item.size && (
                                                <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                                            )}
                                            {item.config && (
                                                <div className="text-xs text-muted-foreground space-y-0.5">
                                                    <p>Type: {item.config.sareeType}</p>
                                                    {item.config.pockets && <p>Pockets: {item.config.pockets}</p>}
                                                    {item.config.palluType && <p>Pallu: {item.config.palluType}</p>}
                                                    {item.config.palluType === 'pleated' && item.config.palluLength && item.config.palluWidth && (
                                                        <p>Pallu Size: {item.config.palluLength} x {item.config.palluWidth} inch</p>
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center space-x-2 border rounded-md">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-none"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </Button>
                                                    <span className="text-sm w-4 text-center">{item.quantity}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-none"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                                <p className="font-bold text-primary">₹{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-destructive self-start -mt-2 -mr-2"
                                            onClick={() => removeItem(item.id, item.size)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="space-y-4 mb-4">
                            <div className="flex justify-between items-center text-lg font-bold text-foreground">
                                <span>Total</span>
                                <span>₹{totalPrice().toLocaleString()}</span>
                            </div>
                            <Button className="w-full btn-primary text-lg py-6 shadow-md hover:shadow-lg transition-all">
                                Proceed to Checkout
                            </Button>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
