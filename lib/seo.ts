/** Canonical site URL for metadata, sitemap, and JSON-LD */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://anthrachitte.in";
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl().replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export const SITE_NAME = "Anthra Chitte";

export const defaultDescription =
  "Elegant, warm, traditional yet clean fashion. Shop handcrafted sarees, linen digital prints, Ganga Pattu, Flexifit dresses, maternity wear, and handmade potli bags. Heartcrafted in India.";

/** Extra keywords merged into root layout metadata (search + discovery). */
export const extendedSiteKeywords = [
  "potli bag online India",
  "handmade purse",
  "velvet clutch wedding",
  "ethnic bags online",
  "sarees with pockets",
] as const;

/** Truncate for meta description (word-safe when possible). */
export function truncateMetaDescription(text: string, max = 160): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

export type ProductCategory = "Maternity" | "Infants" | "Sarees" | "Accessories" | "Purse";

/** Category-specific keywords for product detail pages. */
export function productSeoKeywords(category: ProductCategory): string[] {
  const base = ["Anthra Chitte", "buy online India"];
  switch (category) {
    case "Purse":
      return [
        ...base,
        "handmade potli bag",
        "velvet purse",
        "wedding clutch",
        "festive bag India",
        "ethnic handbag",
      ];
    case "Sarees":
      return [...base, "handloom saree", "silk saree online", "traditional saree India"];
    case "Maternity":
      return [...base, "maternity ethnic wear", "pregnancy friendly dress India"];
    case "Infants":
      return [...base, "baby ethnic wear India"];
    case "Accessories":
      return [...base, "ethnic accessories", "traditional jewellery pouch"];
  }
}

/** Breadcrumb trail for PDPs (matches main category hubs). */
export function productBreadcrumbTrail(
  category: ProductCategory,
  productId: string,
  productName: string,
): { name: string; url: string }[] {
  const base = getSiteUrl().replace(/\/$/, "");
  const home = { name: "Home", url: `${base}/` };
  const productPage = {
    name: productName,
    url: `${base}/product/${encodeURIComponent(productId)}`,
  };
  switch (category) {
    case "Purse":
      return [
        home,
        { name: "Handmade Essentials", url: `${base}/category/handmade-essentials` },
        productPage,
      ];
    case "Sarees":
      return [
        home,
        { name: "Sarees by Fabric", url: `${base}/category/sarees-by-fabric` },
        productPage,
      ];
    case "Maternity":
    case "Infants":
    case "Accessories":
      return [
        home,
        { name: "New Arrivals", url: `${base}/category/new-arrivals` },
        productPage,
      ];
  }
}

/** BreadcrumbList JSON-LD for rich results. */
export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
