"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signInAdmin(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    redirect(
      `/admin/login?error=${encodeURIComponent(error?.message ?? "Login failed")}`
    );
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("id", data.user!.id)
    .single();

  if (!admin) {
    await supabase.auth.signOut();
    redirect(
      `/admin/login?error=${encodeURIComponent(
        "That account isn't set up as an admin."
      )}`
    );
  }

  redirect("/admin/moderation");
}

export async function signOutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
