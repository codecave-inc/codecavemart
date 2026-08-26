import Link from "next/link";
import { signInMerchant } from "../actions";

export default async function MerchantLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirectTo?: string }>;
}) {
  const { error, redirectTo } = await searchParams;

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl font-semibold text-on-surface mb-2">
        Merchant login
      </h1>
      <p className="text-on-surface-variant text-sm mb-8">
        Log in to manage your products and orders.
      </p>

      {error && (
        <p className="mb-6 text-sm text-error bg-error-container/20 border border-error rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <form action={signInMerchant} className="space-y-5">
        <input type="hidden" name="redirectTo" value={redirectTo ?? "/merchant/dashboard"} />
        <div>
          <label className="text-xs uppercase tracking-widest text-secondary-fixed-dim">
            Email
          </label>
          <input
            required
            type="email"
            name="email"
            className="mt-2 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-4 py-3 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-secondary-fixed-dim">
            Password
          </label>
          <input
            required
            type="password"
            name="password"
            className="mt-2 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-4 py-3 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-secondary-container text-surface-container-lowest font-semibold rounded-lg py-3 text-sm uppercase tracking-widest hover:opacity-90"
        >
          Log in
        </button>
      </form>

      <p className="text-xs text-on-surface-variant mt-6 text-center">
        New merchant?{" "}
        <Link href="/merchant/signup" className="text-secondary-fixed-dim hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
