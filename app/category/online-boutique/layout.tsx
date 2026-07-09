import type { Metadata } from "next";
import { getSiteUrl, SITE_NAME } from "@/lib/seo";

const title = "Online Boutique";
const description = `Custom stitching at ${SITE_NAME} — lehenga, choli, kurta, sleeve & neckline styles, and matching mother & baby outfits stitched to your favourite design.`;
const path = "/category/online-boutique";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "custom stitching online India",
    "lehenga stitching",
    "choli blouse custom",
    "mother baby matching outfit",
    "ethnic wear tailor",
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
  },
  twitter: { card: "summary_large_image", title: `${title} | ${SITE_NAME}`, description },
  robots: { index: true, follow: true },
};

export default function OnlineBoutiqueLayout({ children }: { children: React.ReactNode }) {
  return children;
}
