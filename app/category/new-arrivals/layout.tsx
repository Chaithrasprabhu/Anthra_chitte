import type { Metadata } from "next";
import { getSiteUrl, SITE_NAME } from "@/lib/seo";

const title = "New Arrivals";
const description = `Discover fresh arrivals at ${SITE_NAME} — Mysore crepe sarees, handmade essentials, and traditional wear. Shop the latest drops.`;
const path = "/category/new-arrivals";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title: `${title} | ${SITE_NAME}`,
    description,
    url: `${getSiteUrl().replace(/\/$/, "")}${path}`,
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
  },
  twitter: { card: "summary_large_image", title: `${title} | ${SITE_NAME}`, description },
  robots: { index: true, follow: true },
};

export default function NewArrivalsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
