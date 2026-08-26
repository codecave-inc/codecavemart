"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signUpMerchant(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const businessName = String(formData.get("businessName"));

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.user) {
    redirect(`/merchant/signup?error=${encodeURIComponent(error?.message ?? "Sign up failed")}`);
  }

  const { error: profileError } = await supabase.from("merchants").insert({
    id: data.user!.id,
    business_name: businessName,
  });

  if (profileError) {
    redirect(`/merchant/signup?error=${encodeURIComponent(profileError.message)}`);
  }

  redirect("/merchant/dashboard");
}

export async function signInMerchant(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const redirectTo = String(formData.get("redirectTo") || "/merchant/dashboard");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/merchant/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(redirectTo);
}

export async function signOutMerchant() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/merchant/login");
}
