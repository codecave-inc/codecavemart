import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/get-products";
import { formatPrice } from "@/lib/format";
import AddToCart from "@/components/AddToCart";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { product } = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
      <div className="aspect-square rounded-xl overflow-hidden border border-outline-variant bg-surface-container">
        {product.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-secondary-fixed-dim mb-2">
          {product.category ?? "Codecave"} · {product.merchant_name ?? "Codecave Mart"}
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-on-surface mb-3">
          {product.name}
        </h1>
        <p className="text-on-surface-variant mb-6">{product.tagline}</p>

        <div className="flex items-center gap-3 mb-8">
          <span className="text-2xl font-semibold text-on-surface">
            {formatPrice(product.price_cents)}
          </span>
          {product.compare_at_cents && (
            <span className="text-base text-on-surface-variant line-through">
              {formatPrice(product.compare_at_cents)}
            </span>
          )}
        </div>

        <AddToCart product={product} />

        <div className="mt-10 pt-8 border-t border-outline-variant">
          <h2 className="text-xs uppercase tracking-widest text-secondary-fixed-dim mb-3">
            Details
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}
