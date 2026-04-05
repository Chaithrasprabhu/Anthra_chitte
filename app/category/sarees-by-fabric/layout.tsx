import type { Metadata } from "next";
import { getSiteUrl, SITE_NAME } from "@/lib/seo";

const title = "Sarees by Fabric";
const description = `Shop sarees by fabric at ${SITE_NAME} — linen digital prints, Mysore crepe, Ganga Pattu, cotton & silk. Handcrafted traditional wear with pockets & Flexifit options.`;
const path = "/category/sarees-by-fabric";

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

export default function SareesByFabricLayout({ children }: { children: React.ReactNode }) {
  return children;
}
