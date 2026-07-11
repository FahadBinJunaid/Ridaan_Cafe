# Quickstart: Restaurant Ordering Website

**Phase**: 1 — Design & Contracts
**Date**: 2026-07-11

## Prerequisites

- Node.js 20.x+ with npm
- Supabase project (free tier) with:
  - Database, Auth (email/password), Realtime enabled
  - RLS enforced on all tables
- Cloudinary account (free tier) with signed upload enabled
- Vercel account (for deployment)

## Environment Variables

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...     # server-only

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dx...
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abc...          # server-only
```

## Supabase Setup

1. Create tables: `categories`, `menu_items`, `orders`, `order_items`,
   `profiles` — with RLS policies defined in the same migration.
2. Enable Realtime on the `orders` table (INSERT events only).
3. Create a staff user via Supabase Auth (email/password), then insert
   a matching row into `profiles` with `role = 'staff'` or `'admin'`.
4. Test each table's RLS policy (see data-model.md for expected access).

## Running Locally

```bash
npm install        # install dependencies
npm run dev        # start Next.js dev server (http://localhost:3000)
```

## Key URLs

| Path | Description |
|------|-------------|
| `/` | Public homepage (hero, categories, contact) |
| `/menu` | Full scrollable menu |
| `/cart` | Cart review + checkout |
| `/order/confirmation/[reference]` | Order confirmation + receipt |
| `/admin/login` | Staff login |
| `/admin` | Live order dashboard |
| `/admin/menu` | Menu management (categories + items) |
| `/admin/orders/[id]` | Single order detail |
| `/admin/reports` | Revenue reports |

## Deployment

1. Push the branch to GitHub.
2. In Vercel: import repo, set framework to Next.js, add environment
   variables (mark `SUPABASE_SERVICE_ROLE_KEY` and `CLOUDINARY_API_SECRET`
   as server-only).
3. Deploy — preview deployments per branch, production on merge to
   `main`.

## Verification Checklist

- [ ] Public homepage loads with dynamic categories
- [ ] Text search returns matching menu items
- [ ] Add to cart → adjust quantity → checkout → order created
- [ ] Order confirmation shows receipt with print option
- [ ] Admin login works for staff user
- [ ] Admin can create/edit/delete categories (blocked if items exist)
- [ ] Admin can create/edit/delete menu items with image upload
- [ ] Toggle item availability — hidden from public menu immediately
- [ ] New orders appear on dashboard in real time (visual + audio)
- [ ] Order status transitions work correctly
- [ ] Search + pagination on order list work server-side
- [ ] Reports show correct totals (cancelled orders excluded)
- [ ] 404 page and error page render with site theme
- [ ] Zero console errors
- [ ] Test RLS: anonymous user blocked from modifying menu_items
- [ ] Test duplicate submission: rapid double-click creates one order
