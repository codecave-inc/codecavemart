"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

// Only the authenticated merchant area (dashboard/products/orders) supplies
// its own top padding via its sidebar layout. Auth pages (login/signup)
// need the normal top padding like any other page, or their content
// renders flush against the fixed header.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMerchantAuthPage =
    pathname === "/merchant/login" || pathname === "/merchant/signup";
  const isMerchantAppArea =
    pathname?.startsWith("/merchant") && !isMerchantAuthPage;

  return (
    <>
      <main className={isMerchantAppArea ? "" : "pt-20"}>{children}</main>
      {!isMerchantAppArea && <Footer />}
    </>
  );
}
