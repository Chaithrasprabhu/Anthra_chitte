"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

export function ProductImageCarousel({ images, alt, className }: ProductImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const n = images.length;
  if (n === 0) return null;

  const prev = () => setIndex((i) => (i - 1 + n) % n);
  const next = () => setIndex((i) => (i + 1) % n);

  return (
    <div
      className={cn(
        "relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100",
        className
      )}
    >
      {images.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className={cn(
            "absolute inset-0 transition-opacity duration-300",
            i === index ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
          )}
        >
          <Image
            src={src}
            alt={`${alt} — photo ${i + 1} of ${n}`}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      ))}

      {n > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md ring-1 ring-border/60 transition hover:bg-background"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md ring-1 ring-border/60 transition hover:bg-background"
            aria-label="Next photo"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div
            className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-1.5 px-4"
            role="tablist"
            aria-label="Image thumbnails"
          >
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show photo ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index ? "w-7 bg-primary" : "w-2 bg-primary/35 hover:bg-primary/60"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
