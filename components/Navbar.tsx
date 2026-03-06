"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, Search, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartSheet } from "./CartSheet";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
    { name: "Shop Best Sellers", href: "/category/best-sellers" },
    { name: "New Launches", href: "/category/new-launches" },
    { name: "Shop by Occasions", href: "/category/occasions" },
    { name: "Shop Sarees by Fabric", href: "/category/sarees-by-fabric" },
    { name: "Shop Sarees by Colour", href: "/category/sarees-by-colour" },
    { name: "Favorites", href: "/category/favorites" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    // Add scroll listener logic if needed for sticky header styling

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                {/* Mobile Menu */}
                <div className="flex md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <SheetHeader>
                                <SheetTitle className="font-serif text-2xl text-primary text-left">Anthra Chitte</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-4 mt-8">
                                {links.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-lg font-medium hover:text-primary transition-colors border-b pb-2"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border">
                            <Image
                                src="/logo.png"
                                alt="Anthra Chitte Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="font-serif text-2xl lg:text-3xl font-bold tracking-tight text-primary">
                            Anthra Chitte
                        </span>
                    </Link>
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium transition-colors hover:text-primary relative group"
                        >
                            {link.name}
                            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-secondary transition-all group-hover:w-full"></span>
                        </Link>
                    ))}
                </div>

                {/* Icons */}
                <div className="flex items-center gap-2 lg:gap-4">
                    <Button variant="ghost" size="icon" className="hidden sm:flex">
                        <Search className="h-5 w-5" />
                        <span className="sr-only">Search</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="hidden sm:flex">
                        <Heart className="h-5 w-5" />
                        <span className="sr-only">Wishlist</span>
                    </Button>
                    <CartSheet />
                </div>
            </div>
        </nav>
    );
}
