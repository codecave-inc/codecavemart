"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, formatPrice } from "@/lib/cart-context";
import { loadFlutterwaveScript } from "@/lib/load-flutterwave";

type Stage = "form" | "creating" | "paying" | "verifying" | "error";

export default function CheckoutForm({
  initialValues,
}: {
  initialValues: {
    name: string;
    email: string;
    address: string;
    city: string;
    zip: string;
  };
}) {
  const { lines, subtotalCents, clear } = useCart();
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("form");
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({ ...initialValues, phone: "" });

  const update =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const busy = stage === "creating" || stage === "paying" || stage === "verifying";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setStage("creating");

    try {
      // 1. Create the order in Supabase first, unpaid. Flutterwave needs
      // a stable reference (tx_ref) to attach the payment to, and we
      // want a record even if the buyer abandons the payment modal.
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({
            productId: l.product.id,
            name: l.product.name,
            price_cents: l.product.price_cents,
            quantity: l.quantity,
          })),
          shipping: form,
        }),
      });
      const { orderId, totalCents, demo } = await res.json();

      if (demo) {
        // Supabase isn't connected yet — nothing to actually charge.
        clear();
        router.push(`/orders/${orderId}`);
        return;
      }

      // 2. Open the Flutterwave modal.
      setStage("paying");
      await loadFlutterwaveScript();

      window.FlutterwaveCheckout!({
        public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
        tx_ref: orderId,
        amount: totalCents / 100,
        currency: process.env.NEXT_PUBLIC_FLUTTERWAVE_CURRENCY || "USD",
        payment_options: "card, mobilemoney, ussd",
        customer: {
          email: form.email,
          phone_number: form.phone,
          name: form.name,
        },
        customizations: {
          title: "Codecave Mart",
          description: `Order #${orderId.slice(0, 8)}`,
        },
        callback: async (payment: { transaction_id: string; status: string }) => {
          setStage("verifying");
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId,
                transactionId: payment.transaction_id,
              }),
            });
            const result = await verifyRes.json();

            if (result.success) {
              clear();
              router.push(`/orders/${orderId}`);
            } else {
              setStage("error");
              setErrorMessage(
                "We couldn't confirm your payment. If you were charged, contact support with your order number — nothing will be shipped until payment is confirmed."
              );
            }
          } catch {
            setStage("error");
            setErrorMessage(
              "We couldn't confirm your payment. If you were charged, contact support with your order number."
            );
          }
        },
        onclose: () => {
          // Buyer closed the modal without completing payment. The order
          // stays saved as unpaid — let them try again.
          setStage((s) => (s === "verifying" ? s : "form"));
        },
      });
    } catch (err) {
      console.error(err);
      setStage("error");
      setErrorMessage("Something went wrong starting checkout. Please try again.");
    }
  };

  if (lines.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-on-surface-variant">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-12">
      <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
        <h1 className="font-display text-3xl font-semibold text-on-surface mb-2">
          Checkout
        </h1>

        <div>
          <label className="text-xs uppercase tracking-widest text-secondary-fixed-dim">
            Full name
          </label>
          <input
            required
            value={form.name}
            onChange={update("name")}
            className="mt-2 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-4 py-3 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-secondary-fixed-dim">
              Email
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={update("email")}
              className="mt-2 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-4 py-3 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-secondary-fixed-dim">
              Phone
            </label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={update("phone")}
              placeholder="For payment confirmation"
              className="mt-2 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-4 py-3 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
            />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-secondary-fixed-dim">
            Address
          </label>
          <input
            required
            value={form.address}
            onChange={update("address")}
            className="mt-2 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-4 py-3 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-secondary-fixed-dim">
              City
            </label>
            <input
              required
              value={form.city}
              onChange={update("city")}
              className="mt-2 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-4 py-3 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-secondary-fixed-dim">
              ZIP / Postal code
            </label>
            <input
              required
              value={form.zip}
              onChange={update("zip")}
              className="mt-2 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-4 py-3 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
            />
          </div>
        </div>

        {errorMessage && (
          <p className="text-sm text-error bg-error-container/20 border border-error rounded-lg px-4 py-3">
            {errorMessage}
          </p>
        )}

        <p className="text-xs text-on-surface-variant pt-2">
          You'll be asked to pay via Flutterwave (card, bank transfer, or
          mobile money) after clicking below.
        </p>

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-secondary-container text-surface-container-lowest font-semibold rounded-lg py-3 text-sm uppercase tracking-widest hover:opacity-90 disabled:opacity-50"
        >
          {stage === "creating" && "Preparing order…"}
          {stage === "paying" && "Waiting for payment…"}
          {stage === "verifying" && "Confirming payment…"}
          {(stage === "form" || stage === "error") && "Place order"}
        </button>
      </form>

      <div className="border border-outline-variant rounded-xl p-6 h-fit">
        <h2 className="text-xs uppercase tracking-widest text-secondary-fixed-dim mb-4">
          Order summary
        </h2>
        <ul className="space-y-3 mb-4">
          {lines.map(({ product, quantity }) => (
            <li key={product.id} className="flex justify-between text-sm">
              <span className="text-on-surface-variant">
                {product.name} × {quantity}
              </span>
              <span className="text-on-surface">
                {formatPrice(product.price_cents * quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between text-sm pt-4 border-t border-outline-variant font-semibold">
          <span className="text-on-surface">Total</span>
          <span className="text-on-surface">{formatPrice(subtotalCents)}</span>
        </div>
      </div>
    </div>
  );
}
