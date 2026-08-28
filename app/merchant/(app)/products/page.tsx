import Link from "next/link";
import { requireMerchant } from "@/lib/require-merchant";
import { formatPrice } from "@/lib/format";
import DeleteProductButton from "./DeleteProductButton";

export default async function MerchantProductsPage() {
  const { supabase, merchant } = await requireMerchant();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("merchant_id", merchant.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-on-surface tracking-tight">
          Products
        </h1>
        <Link
          href="/merchant/products/new"
          className="inline-flex bg-secondary-container text-surface-container-lowest font-semibold rounded-lg px-5 py-2.5 text-xs uppercase tracking-widest hover:opacity-90"
        >
          + Add product
        </Link>
      </div>

      {!products || products.length === 0 ? (
        <p className="text-sm text-on-surface-variant">
          You haven&apos;t listed any products yet.
        </p>
      ) : (
        <div className="border border-outline-variant rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low">
              <tr className="text-xs uppercase tracking-widest text-on-surface-variant">
                <th className="px-4 py-3 font-normal">Product</th>
                <th className="px-4 py-3 font-normal">Price</th>
                <th className="px-4 py-3 font-normal">Stock</th>
                <th className="px-4 py-3 font-normal">Moderation</th>
                <th className="px-4 py-3 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {products.map((product) => (
                <tr key={product.id} className="text-sm">
                  <td className="px-4 py-3 text-on-surface">{product.name}</td>
                  <td className="px-4 py-3 text-on-surface-variant">
                    {formatPrice(product.price_cents)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        product.in_stock
                          ? "text-secondary-fixed-dim bg-secondary-container/20"
                          : "text-tertiary bg-tertiary-container/20"
                      }`}
                    >
                      {product.in_stock ? "In stock" : "Out of stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`w-fit text-xs px-2 py-1 rounded-full capitalize ${
                          product.moderation_status === "approved"
                            ? "text-secondary-fixed-dim bg-secondary-container/20"
                            : product.moderation_status === "rejected"
                            ? "text-error bg-error-container/20"
                            : "text-on-surface-variant bg-surface-variant/40"
                        }`}
                      >
                        {product.moderation_status ?? "pending"}
                      </span>
                      {product.moderation_status === "rejected" &&
                        product.rejection_reason && (
                          <span className="text-[11px] text-on-surface-variant max-w-xs">
                            {product.rejection_reason}
                          </span>
                        )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/merchant/products/${product.id}/edit`}
                        className="text-xs uppercase tracking-widest text-secondary-fixed-dim hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-on-surface-variant mt-6">
        New listings and edits go through a quick review before they show up
        in the shop.
      </p>
    </div>
  );
}
