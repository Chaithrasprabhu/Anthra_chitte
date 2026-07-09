import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BoutiqueCustomizer } from "@/components/BoutiqueCustomizer";
import { Scissors } from "lucide-react";

export default function OnlineBoutiquePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="text-center mb-10 lg:mb-12">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-4">
            <Scissors className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            Online Boutique
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We stitch costumes in your favourite style — from lehenga and choli to kurta sets,
            sleeve and neckline details, and beautiful matching outfits for mother and baby.
          </p>
        </div>

        <BoutiqueCustomizer />

        <div className="mt-12 grid gap-4 sm:grid-cols-3 text-center text-sm text-muted-foreground">
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="font-medium text-foreground mb-1">Your style, our hands</p>
            <p>Pick silhouettes, sleeves, and necklines you love — we bring them to life.</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="font-medium text-foreground mb-1">Mother & baby sets</p>
            <p>Coordinated festive looks in matching fabrics and colours.</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="font-medium text-foreground mb-1">Consultation first</p>
            <p>Final fabric and pricing confirmed before we begin stitching.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
