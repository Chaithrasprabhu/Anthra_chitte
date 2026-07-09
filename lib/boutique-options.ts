/** Client-safe boutique stitching options — no DB imports. */

export type BoutiqueTab = "outfit" | "style" | "family" | "details";

export const BOUTIQUE_TABS: { id: BoutiqueTab; label: string; description: string }[] = [
  { id: "outfit", label: "Outfit type", description: "Lehenga, choli, kurta & more" },
  { id: "style", label: "Sleeves & neck", description: "Sleeve and neckline styles" },
  { id: "family", label: "Mother & baby", description: "Matching sets for mom and little one" },
  { id: "details", label: "Size & notes", description: "Measurements and special requests" },
];

export const OUTFIT_CATEGORIES = [
  { id: "lehenga", label: "Lehenga" },
  { id: "choli", label: "Choli / Blouse" },
  { id: "kurta", label: "Kurta / Kurti" },
  { id: "saree", label: "Saree (readymade)" },
  { id: "gown", label: "Gown / Indo-western" },
  { id: "sharara", label: "Sharara / Gharara set" },
] as const;

export const LEHENGA_STYLES = [
  "A-line lehenga",
  "Circular / flared lehenga",
  "Mermaid / fish-cut lehenga",
  "Panelled lehenga",
  "Jacket lehenga",
  "Layered / ruffle lehenga",
  "Pleated lehenga skirt",
] as const;

export const CHOLI_STYLES = [
  "Princess-cut choli",
  "Katori blouse",
  "Backless choli",
  "High-neck choli",
  "Halter choli",
  "Off-shoulder choli",
  "Crop choli",
  "Long blouse (kurti style)",
] as const;

export const KURTA_STYLES = [
  "Straight kurta",
  "Anarkali",
  "A-line kurti",
  "Sharara set",
  "Palazzo set",
  "Angarkha style",
  "Peplum kurta",
  "Maternity-friendly kurta",
] as const;

export const SLEEVE_STYLES = [
  "Sleeveless",
  "Cap sleeve",
  "Short sleeve",
  "Elbow length",
  "Full sleeve",
  "Bell sleeve",
  "Bishop sleeve",
  "Ruffle sleeve",
  "Puff sleeve",
  "Cold-shoulder",
  "Off-shoulder",
] as const;

export const NECKLINE_STYLES = [
  "Round neck",
  "V-neck",
  "Sweetheart",
  "Boat neck",
  "Square neck",
  "High neck",
  "Collar neck",
  "Halter neck",
  "Keyhole back",
  "Deep U-back",
] as const;

export const MOTHER_BABY_OPTIONS = [
  "Matching lehenga — mother & daughter",
  "Matching kurta sets — mother & child",
  "Coordinated saree blouse + infant frock",
  "Twin festive outfits (same fabric & colour)",
  "Mother wrap + baby cape / shrug",
  "Custom colour palette for family set",
] as const;

export const OCCASIONS = [
  "Wedding",
  "Reception",
  "Festive / puja",
  "Baby shower",
  "Birthday",
  "Casual ethnic",
  "Maternity occasion",
] as const;

export const FABRIC_PREFERENCES = [
  "Silk",
  "Cotton",
  "Georgette",
  "Crepe",
  "Linen",
  "Velvet",
  "I will provide my own fabric",
  "Help me choose",
] as const;

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Custom measurements"] as const;

export type BoutiqueConfig = {
  outfitCategory: string;
  lehengaStyle?: string;
  choliStyle?: string;
  kurtaStyle?: string;
  sleeveStyle: string;
  necklineStyle: string;
  motherBabySet?: string;
  occasion: string;
  fabricPreference: string;
  size: string;
  babySize?: string;
  notes?: string;
};

export const BOUTIQUE_BASE_PRICE = 999;

export const BOUTIQUE_PRODUCT = {
  id: "boutique-custom-stitch",
  name: "Online Boutique — Custom Stitching",
  category: "Accessories" as const,
  price: BOUTIQUE_BASE_PRICE,
  image: "/logo.png",
  description:
    "Custom-stitched ethnic wear tailored to your style. Our team will confirm fabric, fit, and final pricing after your request.",
};

export function formatBoutiqueSummary(config: BoutiqueConfig): string {
  const lines = [
    `Outfit: ${config.outfitCategory}`,
    config.lehengaStyle && `Lehenga: ${config.lehengaStyle}`,
    config.choliStyle && `Choli: ${config.choliStyle}`,
    config.kurtaStyle && `Kurta: ${config.kurtaStyle}`,
    `Sleeves: ${config.sleeveStyle}`,
    `Neckline: ${config.necklineStyle}`,
    config.motherBabySet && `Mother & baby: ${config.motherBabySet}`,
    `Occasion: ${config.occasion}`,
    `Fabric: ${config.fabricPreference}`,
    `Size: ${config.size}`,
    config.babySize && `Baby size: ${config.babySize}`,
    config.notes && `Notes: ${config.notes}`,
  ].filter(Boolean);
  return lines.join(" · ");
}

export function isBoutiqueCartItem(productId: string): boolean {
  return productId === BOUTIQUE_PRODUCT.id;
}
