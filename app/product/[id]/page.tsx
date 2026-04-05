import { getAllProductIds } from "@/lib/data";
import { getProductById, isFabricProduct, isPurseProduct } from "@/lib/products";
import { ProductDetails } from "@/components/ProductDetails";
import { FabricProductDetails } from "@/components/FabricProductDetails";
import { HandmadeProductDetails } from "@/components/HandmadeProductDetails";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ProductImageCarousel } from "@/components/ProductImageCarousel";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
    buildBreadcrumbJsonLd,
    productBreadcrumbTrail,
    productSeoKeywords,
    truncateMetaDescription,
    type ProductCategory,
    getSiteUrl,
    SITE_NAME,
} from "@/lib/seo";

/** Fresh product data (including ratings) on each request */
export const dynamic = "force-dynamic";

const baseUrl = getSiteUrl();

interface PageProps {
    params: Promise<{ id: string }>;
}

function absoluteImageUrl(path: string) {
    return path.startsWith("http") ? path : `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}

export async function generateStaticParams() {
    const ids = await getAllProductIds();
    return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps) {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) return { title: "Product Not Found" };

    const displayName = isFabricProduct(product) ? product.name || "Saree" : product.name;
    const gallery =
        product.images && product.images.length > 0 ? product.images : [product.image];
    const ogImages = gallery.slice(0, 4).map((src) => ({
        url: absoluteImageUrl(src),
        width: 800,
        height: 1000,
        alt: displayName,
    }));
    const pageUrl = `${baseUrl.replace(/\/$/, "")}/product/${id}`;
    const metaDesc = truncateMetaDescription(product.description);
    const category = product.category as ProductCategory;
    return {
        title: `${displayName} | ${SITE_NAME}`,
        description: metaDesc,
        keywords: productSeoKeywords(category),
        alternates: { canonical: `/product/${id}` },
        openGraph: {
            title: displayName,
            description: metaDesc,
            url: pageUrl,
            siteName: SITE_NAME,
            images: ogImages,
            type: "website",
            locale: "en_IN",
        },
        twitter: {
            card: "summary_large_image",
            title: displayName,
            description: metaDesc,
            images: gallery.slice(0, 4).map((src) => absoluteImageUrl(src)),
        },
        robots: { index: true, follow: true },
    };
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) notFound();

    const gallery =
        product.images && product.images.length > 0 ? product.images : [product.image];
    const imageUrlsForLd = gallery.map((src) => absoluteImageUrl(src));
    const displayName = isFabricProduct(product) ? product.name || "Saree" : product.name;
    const pageUrl = `${baseUrl.replace(/\/$/, "")}/product/${id}`;
    const priceValidUntil = new Date();
    priceValidUntil.setFullYear(priceValidUntil.getFullYear() + 1);

    const offers: Record<string, unknown> = {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: pageUrl,
        priceValidUntil: priceValidUntil.toISOString().slice(0, 10),
    };

    const jsonLd: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: displayName,
        description: product.description,
        image: imageUrlsForLd.length === 1 ? imageUrlsForLd[0] : imageUrlsForLd,
        sku: product.id,
        brand: {
            "@type": "Brand",
            name: SITE_NAME,
        },
        offers,
    };

    if (product.rating != null && product.reviewCount != null && product.reviewCount > 0) {
        jsonLd.aggregateRating = {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1,
        };
    }

    const breadcrumbLd = buildBreadcrumbJsonLd(
        productBreadcrumbTrail(product.category as ProductCategory, id, displayName),
    );

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <JsonLd data={breadcrumbLd} />
            <JsonLd data={jsonLd} />
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-10 sm:px-6 lg:px-8" role="main">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                    {/* Product image(s) — carousel when multiple gallery images */}
                    {gallery.length > 1 ? (
                        <ProductImageCarousel images={gallery} alt={displayName} />
                    ) : (
                        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100 lg:aspect-[3/4]">
                            <Image
                                src={product.image}
                                alt={displayName}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                    )}

                    {/* Product Info */}
                    <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                        {isFabricProduct(product) ? (
                            <FabricProductDetails product={product} />
                        ) : isPurseProduct(product) ? (
                            <HandmadeProductDetails product={product} />
                        ) : (
                            <ProductDetails product={product} />
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
