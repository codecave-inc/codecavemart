import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";

const STEPS = ["Processing", "Packed", "Shipped", "Delivered"];

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let order: {
    id: string;
    status: string;
    total_cents: number;
    created_at: string;
    order_items: { name: string; quantity: number; price_cents: number }[];
  } | null = null;

  if (!id.startsWith("demo-")) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", id)
        .single();
      order = data;
    } catch {
      order = null;
    }
  }

  const stepIndex = order
    ? Math.max(0, STEPS.findIndex((s) => s.toLowerCase() === order!.status))
    : 0;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-secondary-fixed-dim mb-2">
        Order confirmed
      </p>
      <h1 className="font-display text-3xl font-semibold text-on-surface mb-2">
        Thanks — it's on its way to being packed.
      </h1>
      <p className="text-on-surface-variant text-sm mb-10">
        Order <span className="text-on-surface">#{id.slice(0, 8)}</span>
      </p>

      <div className="flex items-center justify-between mb-12">
        {STEPS.map((step, i) => (
          <div key={step} className="flex-1 flex items-center">
            <div
              className={`w-3 h-3 rounded-full ${
                i <= stepIndex ? "bg-secondary-fixed-dim" : "bg-surface-container-high"
              }`}
            />
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-px ${
                  i < stepIndex ? "bg-secondary-fixed-dim" : "bg-outline-variant"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[11px] uppercase tracking-widest text-on-surface-variant mb-12">
        {STEPS.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>

      {order ? (
        <div className="border border-outline-variant rounded-xl p-6">
          <h2 className="text-xs uppercase tracking-widest text-secondary-fixed-dim mb-4">
            Items
          </h2>
          <ul className="space-y-3 mb-4">
            {order.order_items.map((item, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span className="text-on-surface-variant">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-on-surface">
                  {formatPrice(item.price_cents * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between text-sm pt-4 border-t border-outline-variant font-semibold">
            <span className="text-on-surface">Total</span>
            <span className="text-on-surface">{formatPrice(order.total_cents)}</span>
          </div>
        </div>
      ) : (
        <div className="border border-outline-variant rounded-xl p-6 text-sm text-on-surface-variant">
          This is a demo order — connect Supabase (see the README) to see
          real order details here.
        </div>
      )}

      <Link
        href="/products"
        className="inline-block mt-10 text-xs uppercase tracking-widest text-secondary-fixed-dim hover:underline"
      >
        ← Continue shopping
      </Link>
    </div>
  );
}
