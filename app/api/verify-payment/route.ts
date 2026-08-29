import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service";

export async function POST(request: Request) {
  const { orderId, transactionId } = (await request.json()) as {
    orderId: string;
    transactionId: string | number;
  };

  if (!orderId || !transactionId) {
    return NextResponse.json(
      { success: false, error: "Missing orderId or transactionId" },
      { status: 400 }
    );
  }

  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { success: false, error: "Payments aren't configured yet." },
      { status: 500 }
    );
  }

  try {
    const supabase = createServiceRoleClient();

    // Look up the order ourselves — never trust an amount/currency sent
    // from the browser for this check.
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, total_cents, payment_status")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.payment_status === "paid") {
      // Already confirmed (e.g. duplicate callback) — treat as success.
      return NextResponse.json({ success: true });
    }

    // Ask Flutterwave directly whether this transaction really succeeded.
    const verifyRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      { headers: { Authorization: `Bearer ${secretKey}` } }
    );
    const verifyData = await verifyRes.json();

    const tx = verifyData?.data;
    const expectedAmount = order.total_cents / 100;

    const isValid =
      verifyRes.ok &&
      verifyData?.status === "success" &&
      tx?.status === "successful" &&
      tx?.tx_ref === orderId &&
      Number(tx?.amount) >= expectedAmount - 0.01; // allow float rounding

    if (!isValid) {
      await supabase
        .from("orders")
        .update({ payment_status: "failed" })
        .eq("id", orderId);

      return NextResponse.json(
        { success: false, error: "Payment could not be verified" },
        { status: 402 }
      );
    }

    await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        payment_reference: tx.tx_ref,
        flw_transaction_id: String(tx.id),
      })
      .eq("id", orderId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Payment verification error:", err);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}
