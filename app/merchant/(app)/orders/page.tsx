import { requireMerchant } from "@/lib/require-merchant";
import { formatPrice } from "@/lib/format";

export default async function MerchantOrdersPage() {
  const { supabase, merchant } = await requireMerchant();

  const { data: products } = await supabase
    .from("products")
    .select("id")
    .eq("merchant_id", merchant.id);

  const productIds = (products ?? []).map((p) => p.id);

  const { data: items } = productIds.length
    ? await supabase
        .from("order_items")
        .select("*, orders(id, customer_name, customer_email, status, created_at)")
        .in("product_id", productIds)
        .order("created_at", { ascending: false })
    : { data: [] as any[] };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-on-surface tracking-tight mb-8">
        Orders
      </h1>

      {!items || items.length === 0 ? (
        <p className="text-sm text-on-surface-variant">
          No orders yet — they&apos;ll show up here as soon as customers buy
          your products.
        </p>
      ) : (
        <div className="border border-outline-variant rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low">
              <tr className="text-xs uppercase tracking-widest text-on-surface-variant">
                <th className="px-4 py-3 font-normal">Order</th>
                <th className="px-4 py-3 font-normal">Customer</th>
                <th className="px-4 py-3 font-normal">Item</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {items.map((item) => (
                <tr key={item.id} className="text-sm">
                  <td className="px-4 py-3 text-on-surface-variant">
                    #{item.orders?.id?.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3 text-on-surface">
                    {item.orders?.customer_name}
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant">
                    {item.name} × {item.quantity}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full text-secondary-fixed-dim bg-secondary-container/20 capitalize">
                      {item.orders?.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-on-surface">
                    {formatPrice(item.price_cents * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
