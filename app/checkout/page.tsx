"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/PriceDisplay";
import { useCartStore, getSareeItemPrice, READYMADE_ADDON, POCKETS_ADDON } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { ShoppingBag, ArrowLeft } from "lucide-react";

interface AddressForm {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

const initialAddress: AddressForm = {
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
};

export default function CheckoutPage() {
  const { items, subtotalPrice, platformFee, totalPrice, totalItems, clearCart } = useCartStore();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const token = useAuthStore((s) => s.token);
  const userName = useAuthStore((s) => s.userName);
  const userEmail = useAuthStore((s) => s.userEmail);
  const [mounted, setMounted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [address, setAddress] = useState<AddressForm>(initialAddress);
  const [addressError, setAddressError] = useState("");
  const router = useRouter();

  const updateAddress = (field: keyof AddressForm, value: string) => {
    setAddress((p) => ({ ...p, [field]: value }));
    setAddressError("");
  };

  const isAddressValid = () =>
    address.addressLine1.trim() &&
    address.city.trim() &&
    address.state.trim() &&
    address.pincode.trim().length >= 6 &&
    address.phone.trim().length >= 10;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !isLoggedIn && items.length > 0) {
      router.replace("/login?redirect=/checkout");
    }
  }, [mounted, isLoggedIn, items.length, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Redirecting to login...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground opacity-50 mb-4" />
          <h1 className="text-xl font-serif font-bold text-foreground mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add items from our collection to checkout.</p>
          <Button asChild>
            <Link href="/">Shop Now</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const formatItemDetails = (i: (typeof items)[0]) => {
    const lines: string[] = [];
    lines.push(`📷 ${i.name}`);
    if (i.size) lines.push(`• Size: ${i.size}`);
    if (i.config) {
      if (i.config.sareeType) lines.push(`• Type: ${i.config.sareeType} saree`);
      if (i.config.skirtLength) lines.push(`• Skirt length: ${i.config.skirtLength === "free" ? "Free size" : i.config.skirtLength + " inch"}`);
      if (i.config.pockets) lines.push(`• Pockets: ${i.config.pockets}`);
      if (i.config.palluType) {
        const pallu = i.config.palluType === "pleated" && i.config.palluLength && i.config.palluWidth
          ? `${i.config.palluType} (${i.config.palluLength} x ${i.config.palluWidth} inch)`
          : i.config.palluType;
        lines.push(`• Pallu: ${pallu}`);
      }
    }
    lines.push(`• Qty: ${i.quantity} | ₹${(getSareeItemPrice(i) * i.quantity).toLocaleString()}`);
    return lines.join("\n");
  };
  const orderSummary = items.map(formatItemDetails).join("\n\n");
  const total = totalPrice();
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "918660806939";

  const platformFeeAmount = platformFee();
  const buildWhatsAppUrl = (addr: AddressForm) => {
    const customerLines = [
      ...(userName ? [`👤 Customer: ${userName}`] : []),
      ...(userEmail ? [`📧 Email: ${userEmail}`] : []),
    ];
    const customerBlock = customerLines.length > 0 ? customerLines.join("\n") : "";
    const addressBlock = [
      "📍 Delivery Address",
      addr.addressLine1.trim(),
      ...(addr.addressLine2.trim() ? [addr.addressLine2.trim()] : []),
      `${addr.city.trim()}, ${addr.state.trim()} - ${addr.pincode.trim()}`,
      `📞 Phone: ${addr.phone.trim()}`,
    ].join("\n");
    const feeLine = platformFeeAmount > 0 ? `\nPlatform fee: +₹${platformFeeAmount}` : "";
    const fullMessage = `Hi, I'd like to place an order:\n\n${customerBlock ? customerBlock + "\n\n" : ""}${orderSummary}\n\n${addressBlock}${feeLine}\n\n—————————\nTotal: ₹${total.toLocaleString()}`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fullMessage)}`;
  };

  const handleCompleteOrder = async () => {
    if (!isAddressValid()) {
      setAddressError("Please fill all required address fields (Address, City, State, Pincode min 6 digits, Phone min 10 digits)");
      return;
    }
    setAddressError("");
    setCompleting(true);
    try {
      const orderItems = items.map((i) => ({
        productId: i.id,
        name: i.id.includes("-") ? "Saree" : i.name,
        price: getSareeItemPrice(i),
        quantity: i.quantity,
        image: i.image,
        size: i.size,
        config: i.config,
      }));
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          items: orderItems,
          total,
          address: {
            addressLine1: address.addressLine1.trim(),
            addressLine2: address.addressLine2.trim() || undefined,
            city: address.city.trim(),
            state: address.state.trim(),
            pincode: address.pincode.trim(),
            phone: address.phone.trim(),
          },
        }),
      });
      if (res.ok) {
        clearCart();
        window.open(buildWhatsAppUrl(address), "_blank");
      }
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8" role="main">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue shopping
        </Link>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-6">
          Checkout
        </h1>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.size ?? ""}-${JSON.stringify(item.config || {})}`}
              className="flex gap-4 rounded-lg border border-border bg-card p-4"
            >
              <div className="relative w-20 h-24 shrink-0 rounded-md overflow-hidden bg-muted">
                <Image src={item.image} alt={item.id.includes("-") ? "Saree" : item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-medium text-foreground">{item.id.includes("-") ? "Saree" : item.name}</h2>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                {item.config && (
                  <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                    <p>Type: {item.config.sareeType}</p>
                    {item.config.skirtLength && (
                      <p>Skirt length: {item.config.skirtLength === "free" ? "Free size" : `${item.config.skirtLength} inch`}</p>
                    )}
                    {item.config.pockets && <p>Pockets: {item.config.pockets}</p>}
                    {item.config.palluType && <p>Pallu: {item.config.palluType}</p>}
                    {item.config.palluType === "pleated" && item.config.palluLength && item.config.palluWidth && (
                      <p>Pallu: {item.config.palluLength} x {item.config.palluWidth} inch</p>
                    )}
                    {(item.config.readymadeAddon || item.config.pocketsAddon) && (
                      <div className="pt-1 space-y-0.5 text-foreground">
                        <p>Base: ₹{item.price.toLocaleString()}</p>
                        {item.config.readymadeAddon && <p>Readymade: +₹{READYMADE_ADDON}</p>}
                        {item.config.pocketsAddon && <p>With pockets: +₹{POCKETS_ADDON}</p>}
                      </div>
                    )}
                  </div>
                )}
                <PriceDisplay price={getSareeItemPrice(item)} quantity={item.quantity} discountPercent={item.discountPercent} variant="compact" className="mt-1" />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-card p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Delivery address</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="addressLine1" className="block text-sm font-medium text-foreground mb-1">
                Address line 1 <span className="text-destructive">*</span>
              </label>
              <input
                id="addressLine1"
                type="text"
                value={address.addressLine1}
                onChange={(e) => updateAddress("addressLine1", e.target.value)}
                placeholder="House/Flat no., Building, Street"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="addressLine2" className="block text-sm font-medium text-foreground mb-1">
                Address line 2 <span className="text-muted-foreground">(optional)</span>
              </label>
              <input
                id="addressLine2"
                type="text"
                value={address.addressLine2}
                onChange={(e) => updateAddress("addressLine2", e.target.value)}
                placeholder="Landmark, Area"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-foreground mb-1">
                  City <span className="text-destructive">*</span>
                </label>
                <input
                  id="city"
                  type="text"
                  value={address.city}
                  onChange={(e) => updateAddress("city", e.target.value)}
                  placeholder="City"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-foreground mb-1">
                  State <span className="text-destructive">*</span>
                </label>
                <input
                  id="state"
                  type="text"
                  value={address.state}
                  onChange={(e) => updateAddress("state", e.target.value)}
                  placeholder="State"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-foreground mb-1">
                  Pincode <span className="text-destructive">*</span>
                </label>
                <input
                  id="pincode"
                  type="text"
                  value={address.pincode}
                  onChange={(e) => updateAddress("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="6-digit pincode"
                  maxLength={6}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
                  Phone <span className="text-destructive">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={address.phone}
                  onChange={(e) => updateAddress("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10-digit mobile"
                  maxLength={10}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            {addressError && (
              <p className="text-sm text-destructive">{addressError}</p>
            )}
          </div>
        </div>

        <div className="border-t border-border pt-6 space-y-4">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal ({totalItems()} items)</span>
              <span>₹{subtotalPrice().toLocaleString()}</span>
            </div>
            {platformFee() > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>Platform fee (orders under ₹2,000)</span>
                <span>+₹30</span>
              </div>
            )}
          </div>
          <div className="flex justify-between text-lg font-semibold text-foreground pt-2 border-t border-border">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Complete your order by contacting us. We&apos;ll confirm availability and payment details.
          </p>
          <Button
            size="lg"
            className="w-full rounded-full text-lg py-6"
            onClick={handleCompleteOrder}
            disabled={completing || !isAddressValid()}
          >
            {completing ? "Saving order…" : "Complete order via WhatsApp"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Or email us at hello@anthrachitte.com with your cart details.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
