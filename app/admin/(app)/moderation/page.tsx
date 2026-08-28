import { requireAdmin } from "@/lib/require-admin";
import ModerationItem from "./ModerationItem";

export default async function AdminModerationPage() {
  const { supabase } = await requireAdmin();

  const { data: pending } = await supabase
    .from("products")
    .select("*")
    .eq("moderation_status", "pending")
    .order("created_at", { ascending: true });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-on-surface tracking-tight mb-2">
        Flagged items queue
      </h1>
      <p className="text-sm text-on-surface-variant mb-8">
        New and edited product listings wait here until they're approved.
      </p>

      {!pending || pending.length === 0 ? (
        <div className="border border-outline-variant rounded-xl p-8 text-center text-sm text-on-surface-variant">
          Nothing pending review right now.
        </div>
      ) : (
        <ul className="space-y-4">
          {pending.map((product) => (
            <ModerationItem key={product.id} product={product} />
          ))}
        </ul>
      )}
    </div>
  );
}
