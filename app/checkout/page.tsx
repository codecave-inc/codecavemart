"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, formatPrice } from "@/lib/cart-context";

export default function CheckoutPage() {
  const { lines, subtotalCents, clear } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
  });

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({
            productId: l.product.id,
            name: l.product.name,
            price_cents: l.product.price_cents,
            quantity: l.quantity,
          })),
          shipping: form,
        }),
      });
      const data = await res.json();
      clear();
      router.push(`/orders/${data.orderId}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (lines.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-on-surface-variant">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-12">
      <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
        <h1 className="font-display text-3xl font-semibold text-on-surface mb-2">
          Checkout
        </h1>

        <div>
          <label className="text-xs uppercase tracking-widest text-secondary-fixed-dim">
            Full name
          </label>
          <input
            required
            value={form.name}
            onChange={update("name")}
            className="mt-2 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-4 py-3 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-secondary-fixed-dim">
            Email
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={update("email")}
            className="mt-2 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-4 py-3 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-secondary-fixed-dim">
            Address
          </label>
          <input
            required
            value={form.address}
            onChange={update("address")}
            className="mt-2 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-4 py-3 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-secondary-fixed-dim">
              City
            </label>
            <input
              required
              value={form.city}
              onChange={update("city")}
              className="mt-2 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-4 py-3 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-secondary-fixed-dim">
              ZIP / Postal code
            </label>
            <input
              required
              value={form.zip}
              onChange={update("zip")}
              className="mt-2 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-4 py-3 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
            />
          </div>
        </div>

        <p className="text-xs text-on-surface-variant pt-4">
          This starter checkout records the order in Supabase. Wire up a
          payment provider (Stripe, Paystack, etc.) before taking real
          payments — right now no money actually changes hands.
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-secondary-container text-surface-container-lowest font-semibold rounded-lg py-3 text-sm uppercase tracking-widest hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Placing order…" : "Place order"}
        </button>
      </form>

      <div className="border border-outline-variant rounded-xl p-6 h-fit">
        <h2 className="text-xs uppercase tracking-widest text-secondary-fixed-dim mb-4">
          Order summary
        </h2>
        <ul className="space-y-3 mb-4">
          {lines.map(({ product, quantity }) => (
            <li key={product.id} className="flex justify-between text-sm">
              <span className="text-on-surface-variant">
                {product.name} × {quantity}
              </span>
              <span className="text-on-surface">
                {formatPrice(product.price_cents * quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between text-sm pt-4 border-t border-outline-variant font-semibold">
          <span className="text-on-surface">Total</span>
          <span className="text-on-surface">{formatPrice(subtotalCents)}</span>
        </div>
      </div>
    </div>
  );
}
