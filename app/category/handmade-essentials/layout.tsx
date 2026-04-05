import type { Metadata } from "next";
import { absoluteUrl, getSiteUrl, SITE_NAME } from "@/lib/seo";

const title = "Handmade Essentials";
const description = `Handmade bags and accessories at ${SITE_NAME}. Shop velvet potli purses, wedding clutches, and pearl-detail bags—crafted for weddings and festive wear. Buy ethnic handbags online in India.`;
const path = "/category/handmade-essentials";
const ogImage = "/assets/handmade/purse-collection-variety.png";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "handmade potli bag India",
    "velvet purse online",
    "wedding clutch ethnic",
    "festive handbag",
    SITE_NAME,
  ],
  alternates: { canonical: path },
  openGraph: {
    title: `${title} | ${SITE_NAME}`,
    description,
    url: `${getSiteUrl().replace(/\/$/, "")}${path}`,
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    images: [{ url: absoluteUrl(ogImage), width: 1200, height: 1200, alt: `${title} — potli bags and purses` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${SITE_NAME}`,
    description,
    images: [absoluteUrl(ogImage)],
  },
  robots: { index: true, follow: true },
};

export default function HandmadeEssentialsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
