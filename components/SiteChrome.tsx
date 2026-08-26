"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMerchantArea = pathname?.startsWith("/merchant");

  return (
    <>
      <main className={isMerchantArea ? "" : "pt-20"}>{children}</main>
      {!isMerchantArea && <Footer />}
    </>
  );
}
