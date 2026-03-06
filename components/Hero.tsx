import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Hero() {
    return (
        <section className="relative w-full min-h-[calc(100vh-64px)] overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    src="/assets/home-hero.jpeg"
                    alt="Handcrafted saree packaging with butter paper, navy blue butterfly sticker, tags, thread and measuring tape"
                    fill
                    className="object-cover filter brightness-[1.08] contrast-[1.1] saturate-[1.1]"
                    sizes="100vw"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/20 to-black/10" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_60%,rgba(0,0,0,.25)_100%)]" />
            </div>
            <div className="relative z-10 h-full">
                <div className="absolute bottom-8 left-6 sm:left-10 max-w-xl space-y-4 px-2 z-20">
                    <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-white">
                        Elegance in Every <span className="text-secondary">Stitch</span>
                    </h1>
                    <p className="text-lg leading-8 text-white/90">
                        Discover Anthra Chitte&apos;s exclusive collection of handcrafted traditional wear, Maternity Flexifit™ dresses, and Sarees designed for the modern woman—now with pockets.
                    </p>
                    <div className="mt-4 flex items-center gap-x-6">
                        <Button asChild size="lg" className="rounded-full px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105">
                            <Link href="/category/new-arrivals">Shop New Arrivals</Link>
                        </Button>
                        <Link href="/about" className="text-sm font-semibold leading-6 text-white hover:text-secondary transition-colors">
                            Our Story <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
