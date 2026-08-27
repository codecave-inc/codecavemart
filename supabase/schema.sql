-- Codecave Mart — starter schema
-- Run this in Supabase Studio: SQL Editor > New query > paste > Run

create extension if not exists "pgcrypto";

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text,
  description text,
  price_cents integer not null,
  compare_at_cents integer,
  image_url text,
  category text,
  merchant_name text,
  in_stock boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  shipping_address text not null,
  total_cents integer not null,
  status text not null default 'processing',
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  name text not null,
  price_cents integer not null,
  quantity integer not null,
  created_at timestamptz not null default now()
);

-- Row Level Security: allow anyone to read products, but never read/write
-- other people's orders directly from the browser. The API route uses your
-- anon key, so for this starter we allow inserts on orders/order_items too.
-- Tighten this once you add Supabase Auth (e.g. scope orders to auth.uid()).

alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "Public can read products"
  on products for select
  using (true);

create policy "Anyone can create an order"
  on orders for insert
  with check (true);

create policy "Anyone can read an order by id"
  on orders for select
  using (true);

create policy "Anyone can create order items"
  on order_items for insert
  with check (true);

create policy "Anyone can read order items"
  on order_items for select
  using (true);

-- Sample data so the storefront has something real to show immediately.
insert into products (slug, name, tagline, description, price_cents, compare_at_cents, image_url, category, merchant_name)
values
  ('the-atelier-mechanical-keyboard', 'The Atelier Mechanical Keyboard', 'Hand-lapped switches, walnut deck', 'A 75% layout keyboard built for long refactors: hand-lapped tactile switches, a solid walnut deck, and PBT dye-sub keycaps.', 24900, 29900, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80', 'Desk', 'Northbench Co.'),
  ('terminal-canvas-tote', 'Terminal Canvas Tote', 'Waxed canvas, laptop sleeve built in', 'Waxed 16oz canvas tote with a padded 14" laptop sleeve, brass hardware, and a hidden zip pocket.', 8800, null, 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80', 'Bags', 'Fieldwork Supply'),
  ('nomad-monitor-stand', 'Nomad Monitor Stand', 'Solid ash, packs flat', 'A solid ash monitor riser that knocks down flat for travel. Rated to 35lb.', 13500, 15900, 'https://images.unsplash.com/photo-1616627561950-9f746e330187?w=800&q=80', 'Desk', 'Northbench Co.')
on conflict (slug) do nothing;

-- ─────────────────────────────────────────────────────────────
-- Merchant dashboard — accounts, product ownership, order access
-- Added when building the merchant dashboard feature.
-- ─────────────────────────────────────────────────────────────

create table if not exists merchants (
  id uuid primary key references auth.users(id) on delete cascade,
  business_name text not null,
  created_at timestamptz not null default now()
);

alter table merchants enable row level security;

create policy "Merchant can read own profile"
  on merchants for select
  using (auth.uid() = id);

create policy "Merchant can update own profile"
  on merchants for update
  using (auth.uid() = id);

create policy "Anyone can create their own merchant profile"
  on merchants for insert
  with check (auth.uid() = id);

alter table products add column if not exists merchant_id uuid references merchants(id);

create policy "Merchant can insert own products"
  on products for insert
  with check (auth.uid() = merchant_id);

create policy "Merchant can update own products"
  on products for update
  using (auth.uid() = merchant_id);

create policy "Merchant can delete own products"
  on products for delete
  using (auth.uid() = merchant_id);

create policy "Merchant can read order_items for own products"
  on order_items for select
  using (
    exists (
      select 1 from products
      where products.id = order_items.product_id
      and products.merchant_id = auth.uid()
    )
  );

create policy "Merchant can read orders containing own products"
  on orders for select
  using (
    exists (
      select 1 from order_items
      join products on products.id = order_items.product_id
      where order_items.order_id = orders.id
      and products.merchant_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────
-- Customer accounts — order history, saved shipping info
-- ─────────────────────────────────────────────────────────────

alter table orders add column if not exists customer_id uuid references auth.users(id);

create table if not exists customer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  address text,
  city text,
  zip text,
  created_at timestamptz not null default now()
);

alter table customer_profiles enable row level security;

create policy "Customer can read own profile"
  on customer_profiles for select
  using (auth.uid() = id);

create policy "Customer can insert own profile"
  on customer_profiles for insert
  with check (auth.uid() = id);

create policy "Customer can update own profile"
  on customer_profiles for update
  using (auth.uid() = id);

create policy "Customer can read own orders"
  on orders for select
  using (auth.uid() = customer_id);

create policy "Customer can read own order items"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.customer_id = auth.uid()
    )
  );
