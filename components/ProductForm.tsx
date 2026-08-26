import { Product } from "@/lib/types";

export default function ProductForm({
  action,
  product,
  submitLabel,
  error,
}: {
  action: (formData: FormData) => void;
  product?: Product;
  submitLabel: string;
  error?: string;
}) {
  return (
    <form action={action} className="space-y-5 max-w-xl">
      {error && (
        <p className="text-sm text-error bg-error-container/20 border border-error rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div>
        <label className="text-xs uppercase tracking-widest text-secondary-fixed-dim">
          Product name
        </label>
        <input
          required
          name="name"
          defaultValue={product?.name}
          className="mt-2 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-4 py-3 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-secondary-fixed-dim">
          Tagline
        </label>
        <input
          name="tagline"
          defaultValue={product?.tagline ?? ""}
          className="mt-2 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-4 py-3 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-secondary-fixed-dim">
          Description
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={product?.description ?? ""}
          className="mt-2 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-4 py-3 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-widest text-secondary-fixed-dim">
            Price (USD)
          </label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            name="price"
            defaultValue={product ? (product.price_cents / 100).toFixed(2) : ""}
            className="mt-2 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-4 py-3 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-secondary-fixed-dim">
            Category
          </label>
          <input
            name="category"
            defaultValue={product?.category ?? ""}
            className="mt-2 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-4 py-3 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
          />
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-secondary-fixed-dim">
          Image URL
        </label>
        <input
          name="image_url"
          defaultValue={product?.image_url ?? ""}
          placeholder="https://…"
          className="mt-2 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-4 py-3 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-on-surface-variant">
        <input
          type="checkbox"
          name="in_stock"
          defaultChecked={product?.in_stock ?? true}
          className="w-4 h-4"
        />
        In stock / visible in the shop
      </label>

      <button
        type="submit"
        className="bg-secondary-container text-surface-container-lowest font-semibold rounded-lg px-8 py-3 text-sm uppercase tracking-widest hover:opacity-90"
      >
        {submitLabel}
      </button>
    </form>
  );
}
