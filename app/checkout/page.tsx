import { createClient } from "@/lib/supabase/server";
import CheckoutForm from "./CheckoutForm";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialValues = { name: "", email: "", address: "", city: "", zip: "" };

  if (user) {
    const { data: profile } = await supabase
      .from("customer_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    initialValues = {
      name: profile?.full_name ?? "",
      email: user.email ?? "",
      address: profile?.address ?? "",
      city: profile?.city ?? "",
      zip: profile?.zip ?? "",
    };
  }

  return <CheckoutForm initialValues={initialValues} />;
}
