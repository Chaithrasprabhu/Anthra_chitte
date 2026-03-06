"use client";

import { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import fabricSareesData from "@/lib/fabric-sarees.json";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import type { Product } from "@/lib/data";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

const categories = [
    { id: "all", label: "All Fabrics" },
    { id: "dailywear", label: "Daily Wear" },
    { id: "ganga pattu", label: "Ganga Pattu" },
    { id: "jaipuri cotton", label: "Jaipuri Cotton" }
];

export default function SareesByFabricPage() {
    const [selectedFabric, setSelectedFabric] = useState("all");
    const { addItem } = useCartStore();
    const [open, setOpen] = useState(false);
    type FabricItem = {
        id: string;
        name: string;
        fabric: string;
        price: number;
        image: string;
        description: string;
    };
    const [currentProduct, setCurrentProduct] = useState<FabricItem | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [sareeType, setSareeType] = useState<"normal" | "readymade" | undefined>(undefined);
    const [size, setSize] = useState<"XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL" | undefined>(undefined);
    const [pockets, setPockets] = useState<"with" | "without" | undefined>(undefined);
    const [palluType, setPalluType] = useState<"open" | "pleated" | undefined>(undefined);
    const [palluLength, setPalluLength] = useState<"32" | "42" | "47" | undefined>(undefined);
    const [palluWidth, setPalluWidth] = useState<"3" | "5" | "7" | undefined>(undefined);

    const resetSelections = () => {
        setSareeType(undefined);
        setSize(undefined);
        setPockets(undefined);
        setPalluType(undefined);
        setPalluLength(undefined);
        setPalluWidth(undefined);
    };

    const handleBeginAdd = (product: FabricItem) => {
        setCurrentProduct(product);
        resetSelections();
        setOpen(true);
    };

    const handleConfirmAdd = () => {
        if (!currentProduct) return;
        if (!sareeType) return;
        if (sareeType === "readymade") {
            if (!size) return;
            if (!pockets) return;
            if (!palluType) return;
            if (palluType === "pleated") {
                if (!palluLength || !palluWidth) return;
            }
        }
        const productForCart: Product = {
            id: currentProduct.id,
            name: currentProduct.name,
            category: 'Sarees',
            price: currentProduct.price,
            image: currentProduct.image,
            description: currentProduct.description,
        };
        addItem(productForCart, sareeType === "readymade" ? size : undefined, {
            sareeType,
            size,
            pockets,
            palluType,
            palluLength,
            palluWidth,
        });
        setOpen(false);
        resetSelections();
        setCurrentProduct(null);
    };

    const filteredSarees = selectedFabric === "all"
        ? fabricSareesData
        : fabricSareesData.filter(s => s.fabric === selectedFabric);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1 container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground sm:text-5xl mb-4">
                        Shop Sarees by Fabric
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Explore our curated collection of sarees sorted by fabric type. Use the filters below to find exactly what you&apos;re looking for.
                    </p>
                </div>

                {/* Filters */}
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

                {/* Product Grid */}
                {filteredSarees.length > 0 ? (
                    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                        {filteredSarees.map((product) => (
                            <div key={product.id} className="group relative border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-all duration-300">
                                <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 relative">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                        onClick={() => {
                                            setCurrentProduct(product);
                                            setDetailOpen(true);
                                        }}
                                    />
                                    <div className="absolute top-2 right-2 flex gap-2 z-10">
                                        <span className="bg-primary/90 text-primary-foreground text-xs font-medium px-2 py-1 rounded-sm uppercase tracking-wider backdrop-blur-sm">
                                            {product.fabric}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col gap-2">
                                    <h3 className="text-lg font-medium text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                                        {product.description}
                                    </p>
                                    <div className="mt-2 flex items-center justify-between">
                                        <p className="text-lg font-bold text-foreground">
                                            ₹{product.price.toLocaleString('en-IN')}
                                        </p>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="font-medium"
                                            onClick={() => handleBeginAdd(product)}
                                        >
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
                        <p className="text-xl text-muted-foreground">No products found in this category.</p>
                        <Button
                            variant="link"
                            className="mt-4"
                            onClick={() => setSelectedFabric("all")}
                        >
                            Clear filters
                        </Button>
                    </div>
                )}
            </main>

            <OptionSelector
                open={open}
                setOpen={setOpen}
                sareeType={sareeType}
                setSareeType={setSareeType}
                size={size}
                setSize={setSize}
                pockets={pockets}
                setPockets={setPockets}
                palluType={palluType}
                setPalluType={setPalluType}
                palluLength={palluLength}
                setPalluLength={setPalluLength}
                palluWidth={palluWidth}
                setPalluWidth={setPalluWidth}
                onConfirm={handleConfirmAdd}
            />
            <DetailDialog
                open={detailOpen}
                onOpenChange={setDetailOpen}
                product={currentProduct}
                onAdd={() => {
                    if (!currentProduct) return;
                    handleBeginAdd(currentProduct);
                }}
                onBuy={() => {
                    if (!currentProduct) return;
                    handleBeginAdd(currentProduct);
                }}
            />
            <Footer />
        </div>
    );
}

interface OptionSelectorProps {
    open: boolean;
    setOpen: (v: boolean) => void;
    sareeType: "normal" | "readymade" | undefined;
    setSareeType: (v: "normal" | "readymade") => void;
    size: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL" | undefined;
    setSize: (v: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL") => void;
    pockets: "with" | "without" | undefined;
    setPockets: (v: "with" | "without") => void;
    palluType: "open" | "pleated" | undefined;
    setPalluType: (v: "open" | "pleated") => void;
    palluLength: "32" | "42" | "47" | undefined;
    setPalluLength: (v: "32" | "42" | "47") => void;
    palluWidth: "3" | "5" | "7" | undefined;
    setPalluWidth: (v: "3" | "5" | "7") => void;
    onConfirm: () => void;
}

function OptionSelector({
    open,
    setOpen,
    sareeType,
    setSareeType,
    size,
    setSize,
    pockets,
    setPockets,
    palluType,
    setPalluType,
    palluLength,
    setPalluLength,
    palluWidth,
    setPalluWidth,
    onConfirm,
}: OptionSelectorProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Choose Options</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <span className="text-sm font-medium">Saree Type</span>
                        <div className="flex gap-2">
                            <Button variant={sareeType === "normal" ? "default" : "outline"} onClick={() => setSareeType("normal")}>Normal Saree</Button>
                            <Button variant={sareeType === "readymade" ? "default" : "outline"} onClick={() => setSareeType("readymade")}>Readymade Saree</Button>
                        </div>
                    </div>
                    {sareeType === "readymade" && (
                        <>
                            <div className="space-y-2">
                                <span className="text-sm font-medium">Size</span>
                                <Select value={size} onValueChange={(v) => setSize(v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="XS">XS</SelectItem>
                                        <SelectItem value="S">S</SelectItem>
                                        <SelectItem value="M">M</SelectItem>
                                        <SelectItem value="L">L</SelectItem>
                                        <SelectItem value="XL">XL</SelectItem>
                                        <SelectItem value="XXL">XXL</SelectItem>
                                        <SelectItem value="XXXL">XXXL</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <span className="text-sm font-medium">Pockets</span>
                                <div className="flex gap-2">
                                    <Button variant={pockets === "with" ? "default" : "outline"} onClick={() => setPockets("with")}>With Pockets</Button>
                                    <Button variant={pockets === "without" ? "default" : "outline"} onClick={() => setPockets("without")}>Without Pockets</Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-sm font-medium">Pallu</span>
                                <div className="flex gap-2">
                                    <Button variant={palluType === "open" ? "default" : "outline"} onClick={() => setPalluType("open")}>Open Pallu</Button>
                                    <Button variant={palluType === "pleated" ? "default" : "outline"} onClick={() => setPalluType("pleated")}>Pleated Pallu</Button>
                                </div>
                            </div>
                            {palluType === "pleated" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <span className="text-sm font-medium">Pallu Length</span>
                                        <Select value={palluLength} onValueChange={(v) => setPalluLength(v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select length" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="32">32 inch</SelectItem>
                                                <SelectItem value="42">42 inch</SelectItem>
                                                <SelectItem value="47">47 inch</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-sm font-medium">Pallu Width</span>
                                        <Select value={palluWidth} onValueChange={(v) => setPalluWidth(v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select width" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="3">3 inch</SelectItem>
                                                <SelectItem value="5">5 inch</SelectItem>
                                                <SelectItem value="7">7 inch</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={onConfirm} className="w-full">Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function DetailDialog({
    open,
    onOpenChange,
    product,
    onAdd,
    onBuy,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    product: FabricItem | null;
    onAdd: () => void;
    onBuy: () => void;
}) {
    const share = () => {
        const url = typeof window !== "undefined"
            ? `${window.location.origin}/category/sarees-by-fabric#${product?.id ?? ""}`
            : "";
        if (navigator.share && product) {
            navigator.share({
                title: product.name,
                text: product.description,
                url,
            }).catch(() => {});
        } else if (product) {
            navigator.clipboard?.writeText(url).catch(() => {});
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                {product && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="relative w-full aspect-[3/4] rounded-md overflow-hidden bg-muted">
                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <h2 className="text-xl font-semibold text-foreground">{product.name}</h2>
                            <p className="text-lg font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</p>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>Colour: As shown</p>
                                <p>Fabric Type: {product.fabric}</p>
                                <p>Delivery: Within 7 days</p>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2">
                                <Button onClick={onBuy} className="flex-1">Buy Now</Button>
                                <Button variant="secondary" onClick={onAdd} className="flex-1">Add to Cart</Button>
                                <Button variant="outline" onClick={share}>Share Link</Button>
                                <FavButton product={product} />
                            </div>
                        </div>
                    </div>
                )}
                {!product && (
                    <div className="text-sm text-muted-foreground">No product selected.</div>
                )}
            </DialogContent>
        </Dialog>
    );
}

function FavButton({ product }: { product: FabricItem }) {
    const { addFavorite, removeFavorite, isFavorite } = useCartStore();
    const liked = isFavorite(product.id);
    const productForFav: Product = {
        id: product.id,
        name: product.name,
        category: 'Sarees',
        price: product.price,
        image: product.image,
        description: product.description,
    };
    return (
        <Button
            variant={liked ? "secondary" : "outline"}
            onClick={() => {
                if (liked) {
                    removeFavorite(product.id);
                } else {
                    addFavorite(productForFav);
                }
            }}
        >
            Favorites
        </Button>
    );
}
