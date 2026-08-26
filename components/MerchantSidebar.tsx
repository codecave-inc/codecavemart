"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutMerchant } from "@/app/merchant/actions";

const LINKS = [
  { href: "/merchant/dashboard", label: "Dashboard" },
  { href: "/merchant/products", label: "Products" },
  { href: "/merchant/orders", label: "Orders" },
];

export default function MerchantSidebar({ businessName }: { businessName: string }) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex flex-col h-screen sticky top-0 py-8 px-3 w-20 hover:w-56 border-r border-outline-variant bg-surface-container-low flex-shrink-0 transition-all duration-300 group z-20">
      <Link
        href="/merchant/dashboard"
        className="font-display text-lg font-bold text-on-surface mb-10 px-2 whitespace-nowrap overflow-hidden"
      >
        CM
        <span className="hidden group-hover:inline"> · Merchant</span>
      </Link>

      <div className="flex flex-col gap-1 flex-1">
        {LINKS.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-2 py-3 rounded-lg text-xs uppercase tracking-widest whitespace-nowrap overflow-hidden transition-colors ${
                active
                  ? "bg-secondary-container/20 text-secondary-fixed-dim"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="px-2 whitespace-nowrap overflow-hidden">
        <p className="text-[11px] text-on-surface-variant mb-3 truncate">
          {businessName}
        </p>
        <form action={signOutMerchant}>
          <button className="text-xs uppercase tracking-widest text-tertiary hover:underline">
            Log out
          </button>
        </form>
      </div>
    </nav>
  );
}
