import { signInAdmin } from "../actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-lg mx-auto px-4 py-24">
      <h1 className="font-display text-3xl font-semibold text-on-surface mb-3">
        Admin login
      </h1>
      <p className="text-on-surface-variant text-sm leading-relaxed mb-10">
        Restricted to Codecave Mart staff accounts.
      </p>

      {error && (
        <p className="mb-6 text-sm text-error bg-error-container/20 border border-error rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <form action={signInAdmin} className="space-y-6">
        <div>
          <label className="text-xs uppercase tracking-widest text-secondary-fixed-dim">
            Email
          </label>
          <input
            required
            type="email"
            name="email"
            className="mt-2.5 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-4 py-3.5 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
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
            className="mt-2.5 w-full bg-surface-container-low border border-outline-variant focus:border-secondary-fixed-dim rounded-lg px-4 py-3.5 text-sm text-on-surface outline-none focus:ring-4 focus:ring-secondary-fixed-dim/30"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-secondary-container text-surface-container-lowest font-semibold rounded-lg py-3.5 text-sm uppercase tracking-widest hover:opacity-90"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
