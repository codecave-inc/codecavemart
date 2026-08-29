import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Creates the order in an UNPAID state. Payment happens next via the
// Flutterwave modal on the client, then /api/verify-payment confirms
// the transaction server-side and marks the order paid.
export async function POST(request: Request) {
  const body = await request.json();
  const { lines, shipping } = body as {
    lines: { productId: string; name: string; price_cents: number; quantity: number }[];
    shipping: { name: string; email: string; phone: string; address: string; city: string; zip: string };
  };

  if (!lines?.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const totalCents = lines.reduce(
    (sum, l) => sum + l.price_cents * l.quantity,
    0
  );

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: user?.id ?? null,
        customer_name: shipping.name,
        customer_email: shipping.email,
        customer_phone: shipping.phone,
        shipping_address: `${shipping.address}, ${shipping.city} ${shipping.zip}`,
        total_cents: totalCents,
        status: "processing",
        payment_status: "pending",
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const { error: itemsError } = await supabase.from("order_items").insert(
      lines.map((l) => ({
        order_id: order.id,
        product_id: l.productId,
        name: l.name,
        price_cents: l.price_cents,
        quantity: l.quantity,
      }))
    );

    if (itemsError) throw itemsError;

    return NextResponse.json({ orderId: order.id, totalCents });
  } catch (err) {
    // Supabase not configured yet, or tables missing — fall back to a
    // client-only demo order id so the flow can still be tried end to end.
    console.error("Checkout fallback (Supabase not ready):", err);
    return NextResponse.json({ orderId: `demo-${Date.now()}`, totalCents, demo: true });
  }
}
