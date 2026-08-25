"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const { itemCount } = useCart();

  return (
    <header className="bg-background/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-outline-variant">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <Link
          href="/"
          className="font-display text-2xl font-bold text-on-surface tracking-tight focus:ring-4 focus:ring-secondary-fixed-dim focus:outline-none rounded-lg"
        >
          Codecave Mart
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest text-on-surface-variant">
          <Link href="/products" className="hover:text-secondary-fixed-dim transition-colors">
            Shop
          </Link>
          <Link href="/products?category=Desk" className="hover:text-secondary-fixed-dim transition-colors">
            Desk
          </Link>
          <Link href="/orders" className="hover:text-secondary-fixed-dim transition-colors">
            Orders
          </Link>
        </nav>

        <Link
          href="/cart"
          className="relative flex items-center gap-2 border border-outline-variant hover:border-secondary-fixed-dim rounded-lg px-4 py-2 text-xs uppercase tracking-widest text-on-surface transition-colors"
        >
          Cart
          {itemCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-secondary-container text-surface-container-lowest text-[11px] font-bold">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
