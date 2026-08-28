import { requireAdmin } from "@/lib/require-admin";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 px-6 md:px-10 py-10 pt-24 max-w-5xl mx-auto w-full">
        {children}
      </div>
    </div>
  );
}
