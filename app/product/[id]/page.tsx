import { getAllProductIds } from "@/lib/data";
import { getProductById, isFabricProduct, isPurseProduct } from "@/lib/products";
import { ProductDetails } from "@/components/ProductDetails";
import { FabricProductDetails } from "@/components/FabricProductDetails";
import { HandmadeProductDetails } from "@/components/HandmadeProductDetails";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getSiteUrl, SITE_NAME } from "@/lib/seo";

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
    const imageUrl = absoluteImageUrl(product.image);
    const pageUrl = `${baseUrl.replace(/\/$/, "")}/product/${id}`;
    return {
        title: `${displayName} | ${SITE_NAME}`,
        description: product.description.slice(0, 160),
        alternates: { canonical: `/product/${id}` },
        openGraph: {
            title: displayName,
            description: product.description.slice(0, 160),
            url: pageUrl,
            images: [{ url: imageUrl, width: 800, height: 1000, alt: displayName }],
            type: "website",
            locale: "en_IN",
        },
        twitter: {
            card: "summary_large_image",
            title: displayName,
            description: product.description.slice(0, 160),
        },
        robots: { index: true, follow: true },
    };
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) notFound();

    const imageUrl = absoluteImageUrl(product.image);
    const displayName = isFabricProduct(product) ? product.name || "Saree" : product.name;
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: displayName,
        description: product.description,
        image: imageUrl,
        sku: product.id,
        brand: {
            "@type": "Brand",
            name: SITE_NAME,
        },
        offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: `${baseUrl.replace(/\/$/, "")}/product/${id}`,
        },
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <JsonLd data={jsonLd} />
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-10 sm:px-6 lg:px-8" role="main">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                    {/* Product Image */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100 lg:aspect-[3/4]">
                        <Image
                            src={product.image}
                            alt={displayName}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

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
