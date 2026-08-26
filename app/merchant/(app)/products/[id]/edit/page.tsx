import { notFound } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import { requireMerchant } from "@/lib/require-merchant";
import { updateProduct } from "../../actions";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const { supabase, merchant } = await requireMerchant();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("merchant_id", merchant.id)
    .single();

  if (!product) notFound();

  const boundAction = updateProduct.bind(null, id);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-on-surface tracking-tight mb-8">
        Edit product
      </h1>
      <ProductForm
        action={boundAction}
        product={product}
        submitLabel="Save changes"
        error={error}
      />
    </div>
  );
}
