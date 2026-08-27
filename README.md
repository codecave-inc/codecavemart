# Codecave Mart

The customer storefront (home, product listing, product detail, cart,
checkout, order tracking) built from your Stitch design system, in
Next.js + Tailwind, wired to Supabase.

Right now it runs on **demo product data** so it looks right immediately.
Follow the steps below to connect your real Supabase database, then put
it on GitHub and get it live on the internet.

You don't need to write any code for any of this — just follow along.

---

## 1. Create your Supabase project (the backend)

1. Go to [supabase.com](https://supabase.com) and sign in (you said you
   already have an account).
2. Click **New project**. Give it a name like `codecave-mart`, set a
   database password (save it somewhere), pick a region close to your
   customers, and click **Create new project**. Wait ~2 minutes.
3. In the left sidebar, click **SQL Editor** → **New query**.
4. Open the file `supabase/schema.sql` from this project, copy
   everything in it, paste it into the SQL editor, and click **Run**.
   This creates your `products`, `orders`, and `order_items` tables and
   adds 3 sample products.
5. In the left sidebar, click **Project Settings** (gear icon) →
   **Data API**. Copy two values, you'll need them in step 3 below:
   - **Project URL**
   - **anon public** key (under "Project API keys")

## 2. Put the code on GitHub

1. Go to [github.com/new](https://github.com/new) and create a new
   repository named `codecave-mart` (keep it **Private** if you don't
   want the code public). Don't add a README/gitignore — this project
   already has them.
2. On your own computer, unzip the project folder I've given you.
3. Open a terminal (Mac: Terminal app, Windows: PowerShell) in that
   unzipped folder and run these commands one at a time — GitHub's
   "…or push an existing repository" instructions on your new repo's
   page will show you the exact same thing with your username filled
   in, so you can copy from there instead if you prefer:

   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/codecave-mart.git
   git push -u origin main
   ```

   If `git` isn't installed, install it from
   [git-scm.com/downloads](https://git-scm.com/downloads) first (just
   click through the installer with defaults).

## 3. Deploy it live with Vercel (connects straight to GitHub)

GitHub stores your code, but it doesn't *run* a Next.js site — for that
you need a host. **Vercel** is the standard choice for Next.js, it's
free for a project like this, and it deploys straight from your GitHub
repo.

1. Go to [vercel.com](https://vercel.com) and sign up using your
   **GitHub account** (this links them automatically).
2. Click **Add New** → **Project**, then select your `codecave-mart`
   repo and click **Import**.
3. Before clicking Deploy, expand **Environment Variables** and add
   the two values from Supabase (step 1.5):
   - `NEXT_PUBLIC_SUPABASE_URL` → your Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your anon public key
4. Click **Deploy**. In about a minute you'll get a live URL like
   `codecave-mart.vercel.app` — that's your real, working website.

From now on, any time you (or I) push new code to the `main` branch on
GitHub, Vercel automatically redeploys the site. That's the whole
workflow: **edit code → push to GitHub → Vercel updates the live site.**

## 4. Try it end to end

1. Visit your live URL.
2. Browse products (from your Supabase `products` table).
3. Add something to the cart, go to checkout, fill in the form, place
   the order.
4. You'll land on an order confirmation/tracking page — check the
   **Table Editor** in Supabase and you'll see the new row in `orders`
   and `order_items`.

**Note:** checkout currently records the order but doesn't charge a
card — no payment provider is connected yet. Tell me when you're ready
and we can wire up Stripe or Paystack next.

---

## What's built vs. what's next

Built so far:
- **Customer storefront** — home, product listing (with category filter),
  product detail, cart, checkout (writes to Supabase), order confirmation
- **Merchant dashboard** — merchant signup/login (Supabase Auth), a
  dashboard with revenue/units/orders stats and an activity feed, product
  management (list/add/edit/delete, scoped to each merchant via Row Level
  Security), and an orders view showing orders containing that merchant's
  products
- **Customer accounts** — signup/login at `/account/signup` and
  `/account/login`, order history at `/account/orders`, and a saved
  shipping-details form that prefills checkout next time. Guest checkout
  still works (no account required) — orders just aren't linked to a
  login unless the customer signed in first.

Not built yet — say the word when you want to tackle one of these next:
- Admin moderation panel
- AI co-pilot widget on the product page
- Real payments (Stripe/Paystack)

### Trying the merchant dashboard

1. Visit `/merchant/signup` on your live site, create a merchant account
   (business name, email, password).
2. You'll land on `/merchant/dashboard`. Go to **Products → + Add product**
   to list something.
3. Once it's listed, it shows up in the regular shop for customers to buy.
4. After a purchase, check **Dashboard** and **Orders** in the merchant
   area — you'll see real revenue and order data pulled from Supabase.

Each merchant only ever sees and edits their own products/orders — that's
enforced at the database level (Supabase Row Level Security), not just
hidden in the UI.

## Local development (optional)

If you ever want to preview changes on your own computer before they
go live:

```
npm install
cp .env.local.example .env.local   # then fill in your Supabase values
npm run dev
```

Then open `http://localhost:3000`.
