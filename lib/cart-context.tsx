"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { CartLine, Product } from "./types";
export { formatPrice } from "./format";

type CartContextValue = {
  lines: CartLine[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  subtotalCents: number;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "codecave-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore corrupt local storage
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addItem = (product: Product, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.product.id === product.id);
      if (existing) {
        return prev.map((l) =>
          l.product.id === product.id
            ? { ...l, quantity: l.quantity + quantity }
            : l
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setLines((prev) => prev.filter((l) => l.product.id !== productId));
  };

  const setQuantity = (productId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.product.id !== productId)
        : prev.map((l) =>
            l.product.id === productId ? { ...l, quantity } : l
          )
    );
  };

  const clear = () => setLines([]);

  const subtotalCents = useMemo(
    () =>
      lines.reduce((sum, l) => sum + l.product.price_cents * l.quantity, 0),
    [lines]
  );
  const itemCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines]
  );

  return (
    <CartContext.Provider
      value={{
        lines,
        addItem,
        removeItem,
        setQuantity,
        clear,
        subtotalCents,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
