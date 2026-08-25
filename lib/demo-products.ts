import { Product } from "./types";

export const demoProducts: Product[] = [
  {
    id: "1",
    slug: "the-atelier-mechanical-keyboard",
    name: "The Atelier Mechanical Keyboard",
    tagline: "Hand-lapped switches, walnut deck",
    description:
      "A 75% layout keyboard built for long refactors: hand-lapped tactile switches, a solid walnut deck, and PBT dye-sub keycaps. Hot-swappable sockets mean you can retune the feel without a soldering iron.",
    price_cents: 24900,
    compare_at_cents: 29900,
    image_url:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
    category: "Desk",
    merchant_name: "Northbench Co.",
    in_stock: true,
  },
  {
    id: "2",
    slug: "terminal-canvas-tote",
    name: "Terminal Canvas Tote",
    tagline: "Waxed canvas, laptop sleeve built in",
    description:
      "Waxed 16oz canvas tote with a padded 14\" laptop sleeve, brass hardware, and a hidden zip pocket sized for a passport and a deck of stickers.",
    price_cents: 8800,
    compare_at_cents: null,
    image_url:
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80",
    category: "Bags",
    merchant_name: "Fieldwork Supply",
    in_stock: true,
  },
  {
    id: "3",
    slug: "nomad-monitor-stand",
    name: "Nomad Monitor Stand",
    tagline: "Solid ash, packs flat",
    description:
      "A solid ash monitor riser that knocks down flat for travel. Rated to 35lb, felt-lined contact points, cable channel routed along the back edge.",
    price_cents: 13500,
    compare_at_cents: 15900,
    image_url:
      "https://images.unsplash.com/photo-1616627561950-9f746e330187?w=800&q=80",
    category: "Desk",
    merchant_name: "Northbench Co.",
    in_stock: true,
  },
  {
    id: "4",
    slug: "cave-roast-coffee-subscription",
    name: "Cave Roast Coffee — Monthly",
    tagline: "Single-origin, roasted to order",
    description:
      "A rotating single-origin roast shipped fresh every four weeks, dialed in for pour-over. Cancel anytime from your dashboard.",
    price_cents: 2200,
    compare_at_cents: null,
    image_url:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    category: "Fuel",
    merchant_name: "Deep Roast Collective",
    in_stock: true,
  },
  {
    id: "5",
    slug: "signal-noise-cancelling-headset",
    name: "Signal Noise-Cancelling Headset",
    tagline: "40hr battery, boom mic included",
    description:
      "Studio-tuned ANC headset built for pairing calls and deep-focus blocks back to back. Detachable boom mic, 40-hour battery, USB-C fast charge.",
    price_cents: 19900,
    compare_at_cents: 22900,
    image_url:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80",
    category: "Audio",
    merchant_name: "Fieldwork Supply",
    in_stock: true,
  },
  {
    id: "6",
    slug: "grid-desk-mat",
    name: "Grid Desk Mat — Cyan Line",
    tagline: "900x400mm, stitched edge",
    description:
      "An oversized desk mat with a subtle etched grid and a stitched edge that won't fray. Water-resistant top layer, non-slip rubber base.",
    price_cents: 4200,
    compare_at_cents: null,
    image_url:
      "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800&q=80",
    category: "Desk",
    merchant_name: "Deep Roast Collective",
    in_stock: true,
  },
];

export function findDemoProduct(slug: string) {
  return demoProducts.find((p) => p.slug === slug) ?? null;
}
