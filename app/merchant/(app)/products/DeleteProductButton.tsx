"use client";

import { useTransition } from "react";
import { deleteProduct } from "./actions";

export default function DeleteProductButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm("Delete this product? This can't be undone.")) {
          startTransition(() => {
            deleteProduct(productId);
          });
        }
      }}
      className="text-xs uppercase tracking-widest text-tertiary hover:underline disabled:opacity-50"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
