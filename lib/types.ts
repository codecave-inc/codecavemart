export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  price_cents: number;
  compare_at_cents: number | null;
  image_url: string | null;
  category: string | null;
  merchant_name: string | null;
  in_stock: boolean;
};

export type CartLine = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  status: string;
  total_cents: number;
  created_at: string;
  items: { name: string; quantity: number; price_cents: number }[];
};
