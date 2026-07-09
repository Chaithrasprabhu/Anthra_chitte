import { cn } from "@/lib/utils";

interface SoldOutImageOverlayProps {
  soldOut?: boolean;
  className?: string;
  /** Larger label for product detail hero images */
  size?: "sm" | "lg";
}

export function SoldOutImageOverlay({
  soldOut,
  className,
  size = "sm",
}: SoldOutImageOverlayProps) {
  if (!soldOut) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 z-[15] flex items-center justify-center bg-neutral-500/30 pointer-events-none",
        className
      )}
      aria-hidden
    >
      <span
        className={cn(
          "rounded-md bg-white/90 px-4 py-2 font-bold uppercase tracking-[0.18em] text-neutral-800 shadow-md backdrop-blur-sm",
          size === "lg" ? "text-base sm:text-lg px-6 py-3" : "text-xs sm:text-sm"
        )}
      >
        Sold Out
      </span>
    </div>
  );
}
