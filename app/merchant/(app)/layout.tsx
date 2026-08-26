import { requireMerchant } from "@/lib/require-merchant";
import MerchantSidebar from "@/components/MerchantSidebar";

export default async function MerchantAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { merchant } = await requireMerchant();

  return (
    <div className="flex min-h-screen">
      <MerchantSidebar businessName={merchant.business_name} />
      <div className="flex-1 px-6 md:px-10 py-10 pt-24 md:pt-24 max-w-6xl mx-auto w-full">
        {children}
      </div>
    </div>
  );
}
