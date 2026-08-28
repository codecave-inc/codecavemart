"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAdmin } from "@/app/admin/actions";

export default function AdminSidebar() {
  const pathname = usePathname();
  const active = pathname?.startsWith("/admin/moderation");

  return (
    <nav className="hidden md:flex flex-col h-screen sticky top-0 py-8 px-3 w-20 hover:w-56 border-r border-outline-variant bg-surface-container-low flex-shrink-0 transition-all duration-300 group z-20">
      <Link
        href="/admin/moderation"
        className="font-display text-lg font-bold text-secondary-fixed-dim mb-10 px-2 whitespace-nowrap overflow-hidden"
      >
        CM
        <span className="hidden group-hover:inline"> · Admin</span>
      </Link>

      <div className="flex flex-col gap-1 flex-1">
        <Link
          href="/admin/moderation"
          className={`px-2 py-3 rounded-lg text-xs uppercase tracking-widest whitespace-nowrap overflow-hidden transition-colors ${
            active
              ? "bg-secondary-container/20 text-secondary-fixed-dim"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Moderation
        </Link>
      </div>

      <div className="px-2 whitespace-nowrap overflow-hidden">
        <form action={signOutAdmin}>
          <button className="text-xs uppercase tracking-widest text-tertiary hover:underline">
            Log out
          </button>
        </form>
      </div>
    </nav>
  );
}
