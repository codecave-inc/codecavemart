"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signUpCustomer(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const fullName = String(formData.get("fullName"));

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.user) {
    redirect(`/account/signup?error=${encodeURIComponent(error?.message ?? "Sign up failed")}`);
  }

  const { error: profileError } = await supabase
    .from("customer_profiles")
    .insert({ id: data.user!.id, full_name: fullName });

  if (profileError) {
    redirect(`/account/signup?error=${encodeURIComponent(profileError.message)}`);
  }

  redirect("/account/orders");
}

export async function signInCustomer(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const redirectTo = String(formData.get("redirectTo") || "/account/orders");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/account/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(redirectTo);
}

export async function signOutCustomer() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function updateCustomerProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/account/login");

  await supabase.from("customer_profiles").upsert({
    id: user.id,
    full_name: String(formData.get("fullName") || ""),
    address: String(formData.get("address") || ""),
    city: String(formData.get("city") || ""),
    zip: String(formData.get("zip") || ""),
  });

  redirect("/account/orders?saved=1");
}
