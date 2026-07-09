import { cn } from "@/lib/utils";

export function SoldOutBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md bg-neutral-900 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white shadow",
        className
      )}
    >
      Sold Out
    </span>
  );
}
