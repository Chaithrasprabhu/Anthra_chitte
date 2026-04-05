import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/JsonLd";
import { Sparkles, Shirt, Gift, ShoppingBag } from "lucide-react";
import { absoluteUrl, defaultDescription, extendedSiteKeywords, getSiteUrl, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} | Handcrafted Traditional Wear & Sarees Online` },
  description: defaultDescription,
  keywords: [
    "sarees online India",
    "handcrafted sarees",
    "potli bags online",
    "ethnic wear India",
    SITE_NAME,
    ...extendedSiteKeywords,
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} | Handcrafted Traditional Wear & Sarees Online`,
    description: defaultDescription,
    url: getSiteUrl(),
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    images: [{ url: absoluteUrl("/logo.png"), width: 512, height: 512, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Handcrafted Traditional Wear`,
    description: defaultDescription,
  },
};

const categories = [
  { name: "New Arrivals", href: "/category/new-arrivals", icon: Gift, desc: "Fresh arrivals" },
  { name: "Sarees by Fabric", href: "/category/sarees-by-fabric", icon: Shirt, desc: "Cotton, Silk & more" },
  { name: "Handmade Essentials", href: "/category/handmade-essentials", icon: ShoppingBag, desc: "Potli bags & more" },
  { name: "Blouses", href: "/category/blouses", icon: Sparkles, desc: "Designer blouses" },
];

const values = [
  { title: "Handcrafted with Care", desc: "Every piece is lovingly made by skilled artisans." },
  { title: "Modern Meets Traditional", desc: "Contemporary designs with timeless elegance." },
  { title: "Designed for You", desc: "Maternity Flexifit™ and pockets where you need them." },
];

export default function Home() {
  const base = getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${base}#organization`,
        name: SITE_NAME,
        url: base,
        logo: absoluteUrl("/logo.png"),
        description: defaultDescription,
        sameAs: [] as string[],
      },
      {
        "@type": "WebSite",
        "@id": `${base}#website`,
        name: SITE_NAME,
        url: base,
        inLanguage: "en-IN",
        publisher: { "@id": `${base}#organization` },
      },
    ],
  };

  return (
    <main className="min-h-screen flex flex-col bg-background selection:bg-secondary selection:text-secondary-foreground">
      <JsonLd data={structuredData} />
      <Navbar />

      <Hero />

      {/* Shop by Category */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tight">
              Shop by Category
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Find your perfect piece from our curated collections
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-accent p-4 mb-4 group-hover:bg-secondary/20 transition-colors">
                    <cat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{cat.desc}</p>
                  <span className="mt-3 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Anthra Chitte */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tight">
              Why Anthra Chitte
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Thoughtfully designed for the modern woman who values both tradition and comfort
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl bg-background border border-border p-8 text-center shadow-sm"
              >
                <h3 className="font-serif text-xl font-semibold text-foreground">{v.title}</h3>
                <p className="mt-2 text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link href="/about">Our Story</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
