 "use client";
 
 import { Navbar } from "@/components/Navbar";
 import { Footer } from "@/components/Footer";
 import { useCartStore } from "@/store/useCartStore";
 import { ProductCard } from "@/components/ProductCard";
 
 export default function FavoritesPage() {
   const { favorites } = useCartStore();
 
   return (
     <div className="min-h-screen flex flex-col bg-background">
       <Navbar />
 
       <main className="flex-1 container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
         <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground sm:text-5xl mb-12 text-center">
           Favorites
         </h1>
 
         {favorites.length === 0 ? (
           <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
             <p className="text-xl text-muted-foreground">No favorite products yet.</p>
           </div>
         ) : (
           <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
             {favorites.map((product) => (
               <ProductCard key={product.id} product={product} />
             ))}
           </div>
         )}
       </main>
 
       <Footer />
     </div>
   );
 }
