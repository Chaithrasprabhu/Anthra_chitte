import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/data';

type SareeConfig = {
    sareeType: 'normal' | 'readymade';
    size?: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
    pockets?: 'with' | 'without';
    palluType?: 'open' | 'pleated';
    palluLength?: '32' | '42' | '47';
    palluWidth?: '3' | '5' | '7';
};

interface CartItem extends Product {
    quantity: number;
    size?: string;
    config?: SareeConfig;
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product, size?: string, config?: SareeConfig) => void;
    removeItem: (productId: string, size?: string) => void;
    updateQuantity: (productId: string, quantity: number, size?: string) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
    favorites: Product[];
    addFavorite: (product: Product) => void;
    removeFavorite: (productId: string) => void;
    isFavorite: (productId: string) => boolean;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            favorites: [],
            addItem: (product, size, config) => {
                const items = get().items;
                const existingItem = items.find(
                    (item) =>
                        item.id === product.id &&
                        item.size === size &&
                        JSON.stringify(item.config || {}) === JSON.stringify(config || {})
                );
                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.id === product.id &&
                            item.size === size &&
                            JSON.stringify(item.config || {}) === JSON.stringify(config || {})
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({ items: [...items, { ...product, quantity: 1, size, config }] });
                }
            },
            removeItem: (productId, size) => {
                set({ items: get().items.filter((item) => !(item.id === productId && item.size === size)) });
            },
            updateQuantity: (productId, quantity, size) => {
                if (quantity <= 0) {
                    set({ items: get().items.filter((item) => !(item.id === productId && item.size === size)) });
                } else {
                    set({
                        items: get().items.map((item) =>
                            item.id === productId && item.size === size ? { ...item, quantity } : item
                        ),
                    });
                }
            },
            clearCart: () => set({ items: [] }),
            totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
            totalPrice: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
            addFavorite: (product) => {
                const favorites = get().favorites;
                if (!favorites.find((p) => p.id === product.id)) {
                    set({ favorites: [...favorites, product] });
                }
            },
            removeFavorite: (productId) => {
                set({ favorites: get().favorites.filter((p) => p.id !== productId) });
            },
            isFavorite: (productId) => {
                return !!get().favorites.find((p) => p.id === productId);
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);
