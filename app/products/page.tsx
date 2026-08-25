import { getProducts } from "@/lib/get-products";
import ProductCard from "@/components/ProductCard";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const { products } = await getProducts();

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ) as string[];

  const filtered = category
    ? products.filter((p) => p.category === category)
    : products;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl md:text-4xl font-semibold text-on-surface mb-2">
        Shop all
      </h1>
      <p className="text-on-surface-variant text-sm mb-8">
        {filtered.length} product{filtered.length === 1 ? "" : "s"}
      </p>

      <div className="flex flex-wrap gap-2 mb-10">
        <a
          href="/products"
          className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest border ${
            !category
              ? "border-secondary-fixed-dim text-secondary-fixed-dim"
              : "border-outline-variant text-on-surface-variant hover:border-secondary-fixed-dim"
          }`}
        >
          All
        </a>
        {categories.map((c) => (
          <a
            key={c}
            href={`/products?category=${encodeURIComponent(c)}`}
            className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest border ${
              category === c
                ? "border-secondary-fixed-dim text-secondary-fixed-dim"
                : "border-outline-variant text-on-surface-variant hover:border-secondary-fixed-dim"
            }`}
          >
            {c}
          </a>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
