import { requireMerchant } from "@/lib/require-merchant";
import { formatPrice } from "@/lib/format";
import Link from "next/link";

export default async function MerchantDashboardPage() {
  const { supabase, merchant } = await requireMerchant();

  const { data: products } = await supabase
    .from("products")
    .select("id")
    .eq("merchant_id", merchant.id);

  const productIds = (products ?? []).map((p) => p.id);

  const { data: items } = productIds.length
    ? await supabase
        .from("order_items")
        .select("*, orders!inner(created_at, payment_status)")
        .in("product_id", productIds)
        .eq("orders.payment_status", "paid")
    : { data: [] as any[] };

  const revenueCents = (items ?? []).reduce(
    (sum, i) => sum + i.price_cents * i.quantity,
    0
  );
  const unitsSold = (items ?? []).reduce((sum, i) => sum + i.quantity, 0);
  const orderCount = new Set((items ?? []).map((i) => i.order_id)).size;

  const recent = [...(items ?? [])]
    .sort(
      (a, b) =>
        new Date(b.orders?.created_at ?? 0).getTime() -
        new Date(a.orders?.created_at ?? 0).getTime()
    )
    .slice(0, 8);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-on-surface tracking-tight mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <StatCard label="Total Revenue" value={formatPrice(revenueCents)} />
        <StatCard label="Units Sold" value={String(unitsSold)} />
        <StatCard label="Orders" value={String(orderCount)} />
      </div>

      <div className="border border-outline-variant rounded-xl p-6">
        <h2 className="font-display text-lg text-on-surface mb-4">
          Activity feed
        </h2>
        {recent.length === 0 ? (
          <p className="text-sm text-on-surface-variant">
            No sales yet. Once customers buy your products, order activity
            will show up here.
          </p>
        ) : (
          <ul className="divide-y divide-outline-variant">
            {recent.map((item) => (
              <li key={item.id} className="py-3 flex justify-between text-sm">
                <span className="text-on-surface-variant">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-on-surface">
                  {formatPrice(item.price_cents * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {productIds.length === 0 && (
        <div className="mt-8 border border-secondary-fixed-dim/40 bg-secondary-container/10 rounded-xl p-6">
          <p className="text-sm text-on-surface mb-3">
            You haven&apos;t listed any products yet.
          </p>
          <Link
            href="/merchant/products/new"
            className="inline-flex bg-secondary-container text-surface-container-lowest font-semibold rounded-lg px-6 py-2.5 text-xs uppercase tracking-widest hover:opacity-90"
          >
            List your first product
          </Link>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-outline-variant rounded-xl p-6">
      <h3 className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">
        {label}
      </h3>
      <p className="font-display text-3xl font-bold text-on-surface">
        {value}
      </p>
    </div>
  );
}
