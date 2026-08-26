import Link from "next/link";
import { getProducts } from "@/lib/get-products";
import ProductCard from "@/components/ProductCard";

export default async function Home() {
  const { products } = await getProducts();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-32 grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-secondary-fixed-dim mb-4">
              New season / Digital craftsmanship
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight md:leading-[1.05] text-on-surface mb-6">
              Gear for people who build things.
            </h1>
            <p className="text-on-surface-variant text-base md:text-lg leading-relaxed mb-8">
              Codecave Mart curates desk setups, carry, and fuel for
              developers and digital nomads — tested by the people who make
              your tools.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center bg-secondary-container text-surface-container-lowest font-semibold rounded-lg px-8 py-3 text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Shop the collection
            </Link>
          </div>
          <div className="aspect-[4/3] rounded-xl overflow-hidden border border-outline-variant">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=1200&q=80"
              alt="Desk setup"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-on-surface">
            Picked for you
          </h2>
          <Link
            href="/products"
            className="text-xs uppercase tracking-widest text-secondary-fixed-dim hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
