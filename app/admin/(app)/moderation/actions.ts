"use server";

import { requireAdmin } from "@/lib/require-admin";
import { revalidatePath } from "next/cache";

export async function approveProduct(productId: string) {
  const { supabase } = await requireAdmin();

  await supabase
    .from("products")
    .update({ moderation_status: "approved", rejection_reason: null })
    .eq("id", productId);

  revalidatePath("/admin/moderation");
}

export async function rejectProduct(productId: string, reason: string) {
  const { supabase } = await requireAdmin();

  await supabase
    .from("products")
    .update({ moderation_status: "rejected", rejection_reason: reason })
    .eq("id", productId);

  revalidatePath("/admin/moderation");
}
