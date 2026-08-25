import Link from "next/link";

export default function OrdersIndexPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold text-on-surface mb-4">
        Track an order
      </h1>
      <p className="text-on-surface-variant mb-8">
        Open the confirmation link from your order email, or check your inbox
        for the order number. Account-based order history is a good next
        feature to add once customer accounts (Supabase Auth) are wired up.
      </p>
      <Link
        href="/products"
        className="inline-flex bg-secondary-container text-surface-container-lowest font-semibold rounded-lg px-8 py-3 text-sm uppercase tracking-widest hover:opacity-90"
      >
        Continue shopping
      </Link>
    </div>
  );
}
