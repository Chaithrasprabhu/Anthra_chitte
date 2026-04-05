import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-muted/30 border-t border-border mt-auto" role="contentinfo">
            <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <nav className="flex flex-wrap items-center justify-center sm:justify-start gap-6" aria-label="Footer navigation">
                        <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Shop
                        </Link>
                        <Link href="/category/sarees-by-fabric" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Sarees
                        </Link>
                        <Link href="/category/handmade-essentials" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Handmade
                        </Link>
                        <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Our Story
                        </Link>
                    </nav>
                    <div className="flex justify-center sm:justify-end space-x-6">
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.047-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.067-.06-1.407-.06-4.123v-.08c0-2.643.012-2.987.06-4.043.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.047 1.407-.06 4.123-.06h.08zm-1.634-2h2.638c.883 0 1.6.717 1.6 1.6 0 .883-.717 1.6-1.6 1.6h-2.638c-.883 0-1.6-.717-1.6-1.6 0-.883.717-1.6 1.6-1.6z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-border">
                    <p className="text-center text-xs leading-5 text-muted-foreground">
                        &copy; {new Date().getFullYear()} Anthra Chitte. All rights reserved. Handcrafted with ❤️ in India.
                    </p>
                </div>
            </div>
        </footer>
    );
}
