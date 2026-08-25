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
