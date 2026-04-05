import type { Metadata } from "next";
import { getSiteUrl, SITE_NAME } from "@/lib/seo";

const title = "Handmade Essentials";
const description = `Handmade bags and accessories at ${SITE_NAME}. Shop velvet potli purses with pearl and gold detail—crafted for weddings and festive wear.`;
const path = "/category/handmade-essentials";

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

export default function HandmadeEssentialsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
