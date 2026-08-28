"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

// Only the authenticated merchant/admin areas (sidebar layouts) supply
// their own top padding. Auth pages (login/signup) need the normal top
// padding like any other page, or their content renders flush against
// the fixed header.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMerchantAuthPage =
    pathname === "/merchant/login" || pathname === "/merchant/signup";
  const isMerchantAppArea =
    pathname?.startsWith("/merchant") && !isMerchantAuthPage;

  const isAdminAuthPage = pathname === "/admin/login";
  const isAdminAppArea = pathname?.startsWith("/admin") && !isAdminAuthPage;

  const isChromelessArea = isMerchantAppArea || isAdminAppArea;

  return (
    <>
      <main className={isChromelessArea ? "" : "pt-20"}>{children}</main>
      {!isChromelessArea && <Footer />}
    </>
  );
}