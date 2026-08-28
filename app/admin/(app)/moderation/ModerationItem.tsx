"use client";

import { useState, useTransition } from "react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { approveProduct, rejectProduct } from "./actions";

const REASON_TEMPLATES = [
  "Quality standards not met",
  "Missing or unclear product images",
  "Pricing looks incorrect",
];

export default function ModerationItem({ product }: { product: Product }) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <li className="border border-outline-variant rounded-xl p-5">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-24 h-24 rounded-lg overflow-hidden bg-surface-container border border-outline-variant flex-shrink-0">
          {product.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-display text-lg text-on-surface truncate">
            {product.name}
          </h3>
          <p className="text-xs text-on-surface-variant mb-1">
            {product.merchant_name ?? "Unknown merchant"} ·{" "}
            {formatPrice(product.price_cents)}
          </p>
          <p className="text-sm text-on-surface-variant">{product.tagline}</p>

          {!rejecting ? (
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                disabled={isPending}
                onClick={() =>
                  startTransition(() => {
                    approveProduct(product.id);
                  })
                }
                className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-surface border border-outline-variant hover:bg-secondary-fixed-dim hover:text-surface-container-lowest hover:border-secondary-fixed-dim transition-colors text-xs uppercase tracking-widest disabled:opacity-50"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => setRejecting(true)}
                className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-surface border border-error text-error hover:bg-error hover:text-on-error transition-colors text-xs uppercase tracking-widest"
              >
                Reject
              </button>
            </div>
          ) : (
            <div className="mt-4 border-t border-outline-variant pt-4">
              <label className="text-[11px] uppercase tracking-widest text-error mb-2 block">
                Reason for rejection
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {REASON_TEMPLATES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setReason(t)}
                    className="text-[10px] px-2 py-1 rounded-full border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-on-surface transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                placeholder="Let the merchant know what to fix…"
                className="w-full bg-surface-container-low border border-outline-variant focus:border-error rounded-lg px-3 py-2 text-sm text-on-surface outline-none focus:ring-4 focus:ring-error/20 mb-3"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRejecting(false);
                    setReason("");
                  }}
                  className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!reason.trim() || isPending}
                  onClick={() =>
                    startTransition(() => {
                      rejectProduct(product.id, reason.trim());
                    })
                  }
                  className="ml-auto px-4 py-1.5 rounded-lg bg-error text-on-error text-xs uppercase tracking-widest font-bold disabled:opacity-50"
                >
                  Confirm rejection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
