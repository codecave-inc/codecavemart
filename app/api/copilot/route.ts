import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";

// Groq's API is OpenAI-compatible chat completions.
const MODEL = "llama-3.3-70b-versatile";

export async function POST(request: Request) {
  const { productSlug, messages } = (await request.json()) as {
    productSlug: string;
    messages: { role: "user" | "assistant"; content: string }[];
  };

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "The AI co-pilot isn't configured yet." },
      { status: 500 }
    );
  }

  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", productSlug)
    .single();

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const { data: others } = await supabase
    .from("products")
    .select("name, tagline, price_cents, category, slug")
    .eq("moderation_status", "approved")
    .eq("in_stock", true)
    .neq("id", product.id)
    .limit(12);

  const catalogList = (others ?? [])
    .map(
      (p) =>
        `- ${p.name} (${formatPrice(p.price_cents)}, ${p.category ?? "uncategorized"}): ${p.tagline ?? ""}`
    )
    .join("\n");

  const systemPrompt = `You are the AI Co-pilot on Codecave Mart, a shop selling desk gear, carry, and fuel for developers and digital nomads. You're embedded on the product page for one specific item, helping the shopper with questions about fit, specs, or alternatives.

CURRENT PRODUCT:
Name: ${product.name}
Tagline: ${product.tagline ?? "—"}
Price: ${formatPrice(product.price_cents)}
Category: ${product.category ?? "—"}
Description: ${product.description ?? "—"}

OTHER PRODUCTS IN THE SHOP (for alternative suggestions only — never invent products not on this list):
${catalogList || "(none available right now)"}

Rules:
- Only state specs/details that appear above. If asked something you don't have data for, say you don't have that detail rather than guessing.
- Keep answers short — 2-4 sentences, conversational, no markdown headers.
- If suggesting an alternative, only suggest items from the list above, by name.
- If the question is unrelated to shopping or this product, briefly redirect back to how you can help with this product.`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-10), // keep recent context only
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Groq API error:", errText);
      return NextResponse.json(
        { error: "The co-pilot is having trouble right now." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content;

    return NextResponse.json({ reply: reply || "..." });
  } catch (err) {
    console.error("Co-pilot error:", err);
    return NextResponse.json(
      { error: "The co-pilot is having trouble right now." },
      { status: 500 }
    );
  }
}
