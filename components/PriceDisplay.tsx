"use client";

interface PriceDisplayProps {
  price: number;
  quantity?: number;
  discountPercent?: number;
  /** Explicit MRP / list price (e.g. ₹1799 when sale price is ₹1299). Takes precedence over deriving from `discountPercent`. */
  mrp?: number;
  /** Compact: single line. Default: vertical stack */
  variant?: "default" | "compact" | "inline";
  className?: string;
}

export function PriceDisplay({
  price,
  quantity = 1,
  discountPercent,
  mrp,
  variant = "default",
  className = "",
}: PriceDisplayProps) {
  const hasMrp = mrp !== undefined && mrp > price;
  const hasPercentDiscount =
    !hasMrp && discountPercent !== undefined && discountPercent > 0;
  const originalPrice = hasMrp
    ? mrp
    : hasPercentDiscount
      ? Math.round(price / (1 - discountPercent / 100))
      : price;
  const hasDiscount = hasMrp || hasPercentDiscount;
  const displayPrice = price * quantity;
  const displayOriginal = originalPrice * quantity;

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {hasDiscount && (
          <span className="text-sm text-muted-foreground line-through">
            ₹{displayOriginal.toLocaleString("en-IN")}
          </span>
        )}
        <span className="font-bold text-foreground">
          ₹{displayPrice.toLocaleString("en-IN")}
        </span>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <span className={className}>
        {hasDiscount && (
          <span className="text-muted-foreground line-through text-sm mr-1">
            ₹{displayOriginal.toLocaleString("en-IN")}
          </span>
        )}
        <span className="font-bold">₹{displayPrice.toLocaleString("en-IN")}</span>
      </span>
    );
  }

  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      {hasDiscount && (
        <p className="text-sm text-muted-foreground line-through">
          ₹{displayOriginal.toLocaleString("en-IN")}
        </p>
      )}
      <p className="text-lg font-bold text-foreground">
        ₹{displayPrice.toLocaleString("en-IN")}
      </p>
    </div>
  );
}
