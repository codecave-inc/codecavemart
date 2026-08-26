import { createClient } from "./supabase/server";
import { redirect } from "next/navigation";

export async function requireMerchant() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/merchant/login");

  const { data: merchant } = await supabase
    .from("merchants")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!merchant) redirect("/merchant/login");

  return { supabase, user, merchant };
}
