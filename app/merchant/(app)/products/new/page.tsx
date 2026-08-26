import ProductForm from "@/components/ProductForm";
import { createProduct } from "../actions";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-on-surface tracking-tight mb-8">
        List a new product
      </h1>
      <ProductForm action={createProduct} submitLabel="Publish product" error={error} />
    </div>
  );
}
