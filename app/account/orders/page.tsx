import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { signOutCustomer, updateCustomerProfile } from "../actions";

export default async function AccountOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/account/login");

  const { data: profile } = await supabase
    .from("customer_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl font-semibold text-on-surface">
          My account
        </h1>
        <form action={signOutCustomer}>
          <button className="text-xs uppercase tracking-widest text-tertiary hover:underline">
            Log out
          </button>
        </form>
      </div>

      {saved && (
        <p className="mb-8 text-sm text-secondary-fixed-dim bg-secondary-container/10 border border-secondary-fixed-dim/40 rounded-lg px-4 py-3">
          Saved details updated.
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <h2 className="text-xs uppercase tracking-widest text-secondary-fixed-dim mb-4">
            Order history
          </h2>

          {!orders || orders.length === 0 ? (
            <div className="border border-outline-variant rounded-xl p-6 text-sm text-on-surface-variant">
              No orders yet.{" "}
              <Link href="/products" className="text-secondary-fixed-dim hover:underline">
                Start shopping
              </Link>
              .
            </div>
          ) : (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="border border-outline-variant rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-on-surface">
                        Order #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full text-secondary-fixed-dim bg-secondary-container/20 capitalize">
                      {order.status}
                    </span>
                  </div>
                  <ul className="text-sm text-on-surface-variant space-y-1 mb-3">
                    {order.order_items.map((item: any) => (
                      <li key={item.id}>
                        {item.name} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-on-surface">
                      {formatPrice(order.total_cents)}
                    </span>
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-xs uppercase tracking-widest text-secondary-fixed-dim hover:underline"
                    >
                      Track order →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-widest text-secondary-fixed-dim mb-4">
            Saved details
          </h2>
          <form action={updateCustomerProfile} className="space-y-4 border border-outline-variant rounded-xl p-5">
            <div>
              <label className="text-[11px] uppercase tracking-widest text-on-surface-variant">
                Full name
              </label>
              <input
                name="fullName"
                defaultValue={profile?.full_name ?? ""}
                className="mt-2 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-3 py-2.5 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-widest text-on-surface-variant">
                Address
              </label>
              <input
                name="address"
                defaultValue={profile?.address ?? ""}
                className="mt-2 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-3 py-2.5 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] uppercase tracking-widest text-on-surface-variant">
                  City
                </label>
                <input
                  name="city"
                  defaultValue={profile?.city ?? ""}
                  className="mt-2 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-3 py-2.5 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest text-on-surface-variant">
                  ZIP
                </label>
                <input
                  name="zip"
                  defaultValue={profile?.zip ?? ""}
                  className="mt-2 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-3 py-2.5 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-secondary-container text-surface-container-lowest font-semibold rounded-lg py-2.5 text-xs uppercase tracking-widest hover:opacity-90"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
