import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-lg border border-outline-variant hover:border-secondary-fixed-dim bg-surface-container-low overflow-hidden transition-colors"
    >
      <div className="aspect-square overflow-hidden bg-surface-container">
        {product.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
      </div>
      <div className="p-4">
        <p className="text-[11px] uppercase tracking-widest text-secondary-fixed-dim mb-1">
          {product.category ?? "Codecave"}
        </p>
        <h3 className="font-display text-lg text-on-surface leading-snug">
          {product.name}
        </h3>
        <p className="text-xs text-on-surface-variant mt-1">{product.tagline}</p>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-sm font-semibold text-on-surface">
            {formatPrice(product.price_cents)}
          </span>
          {product.compare_at_cents && (
            <span className="text-xs text-on-surface-variant line-through">
              {formatPrice(product.compare_at_cents)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
