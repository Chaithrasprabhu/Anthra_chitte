"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import {
  BOUTIQUE_TABS,
  OUTFIT_CATEGORIES,
  LEHENGA_STYLES,
  CHOLI_STYLES,
  KURTA_STYLES,
  SLEEVE_STYLES,
  NECKLINE_STYLES,
  MOTHER_BABY_OPTIONS,
  OCCASIONS,
  FABRIC_PREFERENCES,
  SIZES,
  BOUTIQUE_BASE_PRICE,
  type BoutiqueConfig,
  type BoutiqueTab,
} from "@/lib/boutique-options";
import { Scissors, Heart, Baby, Shirt, Sparkles, ShoppingCart } from "lucide-react";

function OptionPill({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant={selected ? "default" : "outline"}
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full text-left h-auto py-2 px-4 whitespace-normal",
        selected
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "border-muted-foreground/30 hover:border-primary hover:text-primary"
      )}
    >
      {label}
    </Button>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

const initialConfig: BoutiqueConfig = {
  outfitCategory: "lehenga",
  lehengaStyle: LEHENGA_STYLES[0],
  sleeveStyle: SLEEVE_STYLES[0],
  necklineStyle: NECKLINE_STYLES[0],
  occasion: OCCASIONS[0],
  fabricPreference: FABRIC_PREFERENCES[0],
  size: SIZES[2],
};

export function BoutiqueCustomizer() {
  const router = useRouter();
  const addBoutiqueItem = useCartStore((s) => s.addBoutiqueItem);
  const [tab, setTab] = useState<BoutiqueTab>("outfit");
  const [config, setConfig] = useState<BoutiqueConfig>(initialConfig);
  const [submitted, setSubmitted] = useState(false);

  const patch = (partial: Partial<BoutiqueConfig>) =>
    setConfig((c) => ({ ...c, ...partial }));

  const showLehenga = config.outfitCategory === "lehenga" || config.outfitCategory === "sharara";
  const showCholi =
    config.outfitCategory === "choli" ||
    config.outfitCategory === "lehenga" ||
    config.outfitCategory === "saree";
  const showKurta =
    config.outfitCategory === "kurta" || config.outfitCategory === "sharara";

  const canSubmit =
    config.outfitCategory &&
    config.sleeveStyle &&
    config.necklineStyle &&
    config.occasion &&
    config.fabricPreference &&
    config.size;

  const handleSubmit = () => {
    if (!canSubmit) return;
    addBoutiqueItem(config);
    setSubmitted(true);
    setTimeout(() => router.push("/checkout"), 600);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-8 text-center">
        <Sparkles className="mx-auto mb-3 h-10 w-10 text-primary" />
        <p className="font-serif text-xl font-semibold text-foreground">Request added to cart</p>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ll reach out to confirm measurements, fabric, and final stitching quote.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <nav className="flex flex-row flex-wrap gap-2 lg:flex-col lg:gap-1">
        {BOUTIQUE_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-lg border px-4 py-3 text-left transition-colors lg:w-full",
              tab === t.id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card hover:border-primary/40"
            )}
          >
            <span className="block text-sm font-semibold">{t.label}</span>
            <span className="hidden text-xs text-muted-foreground sm:block">{t.description}</span>
          </button>
        ))}
      </nav>

      <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-8">
        {tab === "outfit" && (
          <>
            <div className="flex items-center gap-2 text-primary">
              <Shirt className="h-5 w-5" />
              <h2 className="font-serif text-xl font-semibold">Choose your outfit</h2>
            </div>
            <Section title="Outfit category" hint="What would you like us to stitch?">
              {OUTFIT_CATEGORIES.map((o) => (
                <OptionPill
                  key={o.id}
                  label={o.label}
                  selected={config.outfitCategory === o.id}
                  onClick={() =>
                    patch({
                      outfitCategory: o.id,
                      lehengaStyle: o.id === "lehenga" || o.id === "sharara" ? LEHENGA_STYLES[0] : undefined,
                      choliStyle: ["choli", "lehenga", "saree"].includes(o.id) ? CHOLI_STYLES[0] : undefined,
                      kurtaStyle: ["kurta", "sharara"].includes(o.id) ? KURTA_STYLES[0] : undefined,
                    })
                  }
                />
              ))}
            </Section>

            {showLehenga && (
              <Section title="Lehenga style">
                {LEHENGA_STYLES.map((s) => (
                  <OptionPill
                    key={s}
                    label={s}
                    selected={config.lehengaStyle === s}
                    onClick={() => patch({ lehengaStyle: s })}
                  />
                ))}
              </Section>
            )}

            {showCholi && (
              <Section title="Choli / blouse style">
                {CHOLI_STYLES.map((s) => (
                  <OptionPill
                    key={s}
                    label={s}
                    selected={config.choliStyle === s}
                    onClick={() => patch({ choliStyle: s })}
                  />
                ))}
              </Section>
            )}

            {showKurta && (
              <Section title="Kurta / kurti style">
                {KURTA_STYLES.map((s) => (
                  <OptionPill
                    key={s}
                    label={s}
                    selected={config.kurtaStyle === s}
                    onClick={() => patch({ kurtaStyle: s })}
                  />
                ))}
              </Section>
            )}
          </>
        )}

        {tab === "style" && (
          <>
            <div className="flex items-center gap-2 text-primary">
              <Scissors className="h-5 w-5" />
              <h2 className="font-serif text-xl font-semibold">Sleeves & neckline</h2>
            </div>
            <Section title="Sleeve style">
              {SLEEVE_STYLES.map((s) => (
                <OptionPill
                  key={s}
                  label={s}
                  selected={config.sleeveStyle === s}
                  onClick={() => patch({ sleeveStyle: s })}
                />
              ))}
            </Section>
            <Section title="Neckline style">
              {NECKLINE_STYLES.map((s) => (
                <OptionPill
                  key={s}
                  label={s}
                  selected={config.necklineStyle === s}
                  onClick={() => patch({ necklineStyle: s })}
                />
              ))}
            </Section>
          </>
        )}

        {tab === "family" && (
          <>
            <div className="flex items-center gap-2 text-primary">
              <Baby className="h-5 w-5" />
              <h2 className="font-serif text-xl font-semibold">Mother & baby matching</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Love a coordinated look? Pick a matching set and we&apos;ll stitch mother and baby outfits
              in the same fabric palette and festive detail.
            </p>
            <Section title="Matching set (optional)">
              <OptionPill
                label="Not a matching set"
                selected={!config.motherBabySet}
                onClick={() => patch({ motherBabySet: undefined, babySize: undefined })}
              />
              {MOTHER_BABY_OPTIONS.map((s) => (
                <OptionPill
                  key={s}
                  label={s}
                  selected={config.motherBabySet === s}
                  onClick={() => patch({ motherBabySet: s })}
                />
              ))}
            </Section>
            {config.motherBabySet && (
              <Section title="Baby / child size">
                {SIZES.slice(0, 5).map((s) => (
                  <OptionPill
                    key={`baby-${s}`}
                    label={s}
                    selected={config.babySize === s}
                    onClick={() => patch({ babySize: s })}
                  />
                ))}
                <OptionPill
                  label="Custom baby measurements"
                  selected={config.babySize === "Custom"}
                  onClick={() => patch({ babySize: "Custom" })}
                />
              </Section>
            )}
          </>
        )}

        {tab === "details" && (
          <>
            <div className="flex items-center gap-2 text-primary">
              <Heart className="h-5 w-5" />
              <h2 className="font-serif text-xl font-semibold">Occasion, fabric & fit</h2>
            </div>
            <Section title="Occasion">
              {OCCASIONS.map((s) => (
                <OptionPill
                  key={s}
                  label={s}
                  selected={config.occasion === s}
                  onClick={() => patch({ occasion: s })}
                />
              ))}
            </Section>
            <Section title="Fabric preference">
              {FABRIC_PREFERENCES.map((s) => (
                <OptionPill
                  key={s}
                  label={s}
                  selected={config.fabricPreference === s}
                  onClick={() => patch({ fabricPreference: s })}
                />
              ))}
            </Section>
            <Section title="Your size">
              {SIZES.map((s) => (
                <OptionPill
                  key={s}
                  label={s}
                  selected={config.size === s}
                  onClick={() => patch({ size: s })}
                />
              ))}
            </Section>
            <div className="space-y-2">
              <label htmlFor="boutique-notes" className="text-sm font-semibold text-foreground">
                Design notes & inspiration
              </label>
              <p className="text-xs text-muted-foreground">
                Colour, embroidery, dupatta style, reference photos, or anything else you have in mind.
              </p>
              <textarea
                id="boutique-notes"
                rows={4}
                value={config.notes ?? ""}
                onChange={(e) => patch({ notes: e.target.value })}
                placeholder="e.g. Pastel pink lehenga with gold zari, mirror work on choli, full sleeves..."
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y min-h-[100px]"
              />
            </div>
          </>
        )}

        <Separator />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Stitching consultation from</p>
            <p className="text-2xl font-bold text-primary">
              ₹{BOUTIQUE_BASE_PRICE.toLocaleString("en-IN")}
              <span className="ml-1 text-sm font-normal text-muted-foreground">+ fabric & final quote</span>
            </p>
          </div>
          <Button
            size="lg"
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            <ShoppingCart className="h-5 w-5" />
            Request custom stitch
          </Button>
        </div>
      </div>
    </div>
  );
}
