"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/lib/types";

export default function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-outline-variant rounded-lg">
          <button
            type="button"
            aria-label="Decrease quantity"
            className="w-10 h-10 text-lg text-on-surface hover:text-secondary-fixed-dim"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <span className="w-10 text-center text-sm">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            className="w-10 h-10 text-lg text-on-surface hover:text-secondary-fixed-dim"
            onClick={() => setQuantity((q) => q + 1)}
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            addItem(product, quantity);
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
          }}
          className="flex-1 bg-secondary-container text-surface-container-lowest font-semibold rounded-lg py-3 text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          {added ? "Added ✓" : "Add to cart"}
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          addItem(product, quantity);
          router.push("/cart");
        }}
        className="border border-outline-variant hover:border-secondary-fixed-dim rounded-lg py-3 text-sm uppercase tracking-widest text-on-surface transition-colors"
      >
        Buy now
      </button>
    </div>
  );
}
