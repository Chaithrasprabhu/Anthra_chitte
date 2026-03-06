import { getProductById, getProducts } from "@/lib/data";
import { ProductDetails } from "@/components/ProductDetails";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

// Generate static params for all products (optional for pure dynamic, but good for performance)
export async function generateStaticParams() {
    const products = await getProducts();
    return products.map((product) => ({
        id: product.id,
    }));
}

export async function generateMetadata({ params }: PageProps) {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) return { title: "Product Not Found" };

    return {
        title: `${product.name} | Anthra Chitte`,
        description: product.description,
    };
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-10 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                    {/* Product Image */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100 lg:aspect-[3/4]">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Product Info */}
                    <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                        <ProductDetails product={product} />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
