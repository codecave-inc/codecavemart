"use client";

import Link from "next/link";
import { useCart, formatPrice } from "@/lib/cart-context";

export default function CartPage() {
  const { lines, setQuantity, removeItem, subtotalCents } = useCart();

  if (lines.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold text-on-surface mb-4">
          Your cart is empty
        </h1>
        <p className="text-on-surface-variant mb-8">
          Add something from the shop to get started.
        </p>
        <Link
          href="/products"
          className="inline-flex bg-secondary-container text-surface-container-lowest font-semibold rounded-lg px-8 py-3 text-sm uppercase tracking-widest hover:opacity-90"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-12">
      <div className="md:col-span-2">
        <h1 className="font-display text-3xl font-semibold text-on-surface mb-8">
          Your cart
        </h1>
        <ul className="divide-y divide-outline-variant">
          {lines.map(({ product, quantity }) => (
            <li key={product.id} className="flex gap-4 py-6">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-surface-container border border-outline-variant flex-shrink-0">
                {product.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <p className="font-display text-lg text-on-surface">
                      {product.name}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {formatPrice(product.price_cents)} each
                    </p>
                  </div>
                  <p className="font-semibold text-on-surface">
                    {formatPrice(product.price_cents * quantity)}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center border border-outline-variant rounded-lg">
                    <button
                      className="w-8 h-8 text-on-surface hover:text-secondary-fixed-dim"
                      onClick={() => setQuantity(product.id, quantity - 1)}
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{quantity}</span>
                    <button
                      className="w-8 h-8 text-on-surface hover:text-secondary-fixed-dim"
                      onClick={() => setQuantity(product.id, quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="text-xs uppercase tracking-widest text-tertiary hover:underline"
                    onClick={() => removeItem(product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="border border-outline-variant rounded-xl p-6 h-fit">
        <h2 className="text-xs uppercase tracking-widest text-secondary-fixed-dim mb-4">
          Order summary
        </h2>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-on-surface-variant">Subtotal</span>
          <span className="text-on-surface">{formatPrice(subtotalCents)}</span>
        </div>
        <div className="flex justify-between text-sm mb-4">
          <span className="text-on-surface-variant">Shipping</span>
          <span className="text-on-surface-variant">Calculated at checkout</span>
        </div>
        <Link
          href="/checkout"
          className="block text-center bg-secondary-container text-surface-container-lowest font-semibold rounded-lg py-3 text-sm uppercase tracking-widest hover:opacity-90"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
