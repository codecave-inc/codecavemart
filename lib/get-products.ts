import { createClient } from "./supabase/server";
import { Product } from "./types";
import { demoProducts, findDemoProduct } from "./demo-products";

export async function getProducts(): Promise<{
  products: Product[];
  isDemo: boolean;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("in_stock", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return { products: demoProducts, isDemo: true };
    }
    return { products: data as Product[], isDemo: false };
  } catch {
    return { products: demoProducts, isDemo: true };
  }
}

export async function getProductBySlug(slug: string): Promise<{
  product: Product | null;
  isDemo: boolean;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return { product: findDemoProduct(slug), isDemo: true };
    }
    return { product: data as Product, isDemo: false };
  } catch {
    return { product: findDemoProduct(slug), isDemo: true };
  }
}
