"use server";

import { requireMerchant } from "@/lib/require-merchant";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProduct(formData: FormData) {
  const { supabase, merchant } = await requireMerchant();

  const name = String(formData.get("name"));
  const price = Number(formData.get("price"));

  const { error } = await supabase.from("products").insert({
    merchant_id: merchant.id,
    merchant_name: merchant.business_name,
    name,
    slug: `${slugify(name)}-${Date.now().toString(36)}`,
    tagline: String(formData.get("tagline") || ""),
    description: String(formData.get("description") || ""),
    price_cents: Math.round(price * 100),
    image_url: String(formData.get("image_url") || "") || null,
    category: String(formData.get("category") || "") || null,
    in_stock: formData.get("in_stock") === "on",
    moderation_status: "pending",
  });

  if (error) {
    redirect(`/merchant/products/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/merchant/products");
  redirect("/merchant/products");
}

export async function updateProduct(productId: string, formData: FormData) {
  const { supabase, merchant } = await requireMerchant();

  const price = Number(formData.get("price"));

  const { error } = await supabase
    .from("products")
    .update({
      name: String(formData.get("name")),
      tagline: String(formData.get("tagline") || ""),
      description: String(formData.get("description") || ""),
      price_cents: Math.round(price * 100),
      image_url: String(formData.get("image_url") || "") || null,
      category: String(formData.get("category") || "") || null,
      in_stock: formData.get("in_stock") === "on",
      // Edits go back through moderation before they're visible again.
      moderation_status: "pending",
      rejection_reason: null,
    })
    .eq("id", productId)
    .eq("merchant_id", merchant.id);

  if (error) {
    redirect(
      `/merchant/products/${productId}/edit?error=${encodeURIComponent(error.message)}`
    );
  }

  revalidatePath("/merchant/products");
  redirect("/merchant/products");
}

export async function deleteProduct(productId: string) {
  const { supabase, merchant } = await requireMerchant();

  await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("merchant_id", merchant.id);

  revalidatePath("/merchant/products");
}
