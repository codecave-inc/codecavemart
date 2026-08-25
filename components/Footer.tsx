export default function Footer() {
  return (
    <footer className="bg-primary-container/40 border-t border-outline-variant mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-xl font-semibold text-on-surface mb-3">
            Codecave Mart
          </p>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Premium goods for builders. Curated, tested, shipped fast.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-secondary-fixed-dim mb-3">
            Shop
          </p>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li>Desk</li>
            <li>Bags</li>
            <li>Audio</li>
            <li>Fuel</li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-secondary-fixed-dim mb-3">
            Support
          </p>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li>Order tracking</li>
            <li>Returns</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-secondary-fixed-dim mb-3">
            Sell on Codecave
          </p>
          <ul className="space-y-2 text-sm text-on-surface-variant">
            <li>Become a merchant</li>
            <li>Merchant dashboard</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-outline-variant px-6 py-6 text-center text-[11px] text-on-surface-variant">
        © {new Date().getFullYear()} Codecave Mart. All rights reserved.
      </div>
    </footer>
  );
}
