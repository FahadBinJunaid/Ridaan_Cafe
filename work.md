# Rindaan Cafe & Cuisine — Complete Work Report

> **Project**: Restaurant Ordering Website  
> **Stack**: Next.js 16.2.10 + Supabase + Tailwind v4 + shadcn/ui  
> **Deploy**: Vercel  
> **Date**: 2026-07-12  

---

## 1. Project Overview

Full-stack restaurant ordering website where:
- **Guests**: Browse menu by category, search items, view dish details, add to cart (Zustand), place COD orders
- **Staff**: Login via Supabase Auth, manage categories + menu items (CRUD + Cloudinary images), view live orders with Realtime updates, update order status, view revenue reports

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.10 (App Router, Turbopack) |
| Language | TypeScript 5.x (strict mode) |
| Styling | Tailwind CSS v4 + tw-animate-css |
| UI Library | shadcn/ui (base-ui render) |
| Icons | lucide-react |
| Database | Supabase PostgreSQL (timestamptz, RLS) |
| Auth | Supabase Auth (email/password) |
| Realtime | Supabase Realtime (postgres_changes) |
| State Mgmt | Zustand 5 (cart, persist) |
| Forms | React Hook Form 7 + Zod 4 |
| Image Hosting | Cloudinary (signed uploads) |
| Animations | framer-motion 12 |

---

## 3. Complete Folder Structure

```
Ridaan_Cafe/
├── .env.local                    # Supabase URL/keys, Cloudinary API keys
├── .gitignore
├── AGENTS.md                     # Next.js 16 breaking-changes notice
├── components.json               # shadcn/ui config (base-nova style)
├── eslint.config.mjs
├── next.config.ts                # Empty (no custom config)
├── next-env.d.ts
├── opencode.md                   # AI agent rules
├── package.json
├── postcss.config.mjs
├── tsconfig.json                 # strict, bundler, @/* -> ./src/*
├── README.md
│
├── specs/001-restaurant-ordering/
│   ├── spec.md                   # Feature specification (design doc)
│   ├── plan.md                   # Technical implementation plan
│   ├── research.md               # Phase 0 research
│   ├── data-model.md             # ERD + column definitions
│   ├── tasks.md                  # 62 tasks across 13 milestones
│   ├── quickstart.md
│   ├── contracts/
│   │   └── server-actions.md     # Server action contracts
│   └── checklists/
│       └── requirements.md
│
├── supabase/
│   ├── seed.sql                  # Sample data (categories + menu items)
│   ├── create-staff-user.sql     # Manual staff user creation
│   └── migrations/
│       ├── 00001_init_categories.sql
│       ├── 00002_init_menu_items.sql
│       ├── 00003_init_orders_order_items.sql
│       ├── 00004_init_profiles.sql
│       └── 00005_enable_realtime.sql
│
├── public/                       # 5 SVG files (favicon, next, vercel, etc.)
│
├── src/
│   ├── proxy.ts                  # MIDDLEWARE — protects /admin routes
│   │
│   ├── app/
│   │   ├── globals.css           # Tailwind v4 + warm/wooden theme tokens
│   │   ├── icon.svg              # Restaurant-themed favicon
│   │   ├── layout.tsx            # Root layout (Geist font, header, OG metadata)
│   │   ├── page.tsx              # HOMEPAGE — hero, categories, contact, JSON-LD
│   │   ├── error.tsx             # Global error boundary (500 page)
│   │   ├── not-found.tsx         # Custom 404 page
│   │   ├── sitemap.ts            # Dynamic sitemap.xml
│   │   ├── robots.ts             # robots.txt
│   │   │
│   │   ├── cart/
│   │   │   ├── page.tsx          # Cart page (metadata export)
│   │   │   └── cart-content.tsx  # Client: cart review + checkout form
│   │   │
│   │   ├── menu/
│   │   │   ├── page.tsx          # Full menu (server: fetch + filter/search UI)
│   │   │   └── [slug]/
│   │   │       ├── page.tsx      # Dish detail (async params, join query)
│   │   │       └── loading.tsx   # Loading skeleton
│   │   │
│   │   ├── order/confirmation/[reference]/
│   │   │   └── page.tsx          # Order confirmation + receipt
│   │   │
│   │   ├── (auth)/admin/login/
│   │   │   └── page.tsx          # Staff login form
│   │   │
│   │   └── (admin)/admin/
│   │       ├── layout.tsx        # Admin sidebar + auth guard
│   │       ├── page.tsx          # Order dashboard (server: paginated list)
│   │       ├── menu/page.tsx     # Menu management (CRUD + Cloudinary)
│   │       ├── orders/[id]/
│   │       │   └── page.tsx      # Single order detail
│   │       └── reports/page.tsx  # Revenue reports (4 periods + custom range)
│   │
│   └── (rest of src/)
│       ├── actions/              # 6 server actions
│       ├── lib/                  # utils, supabase clients, zod schemas, zustand store
│       └── components/
│           ├── ui/               # 9 shadcn/ui primitives (badge, button, card, etc.)
│           └── shared/           # 11 shared components
│
└── history/prompts/              # ALL AI agent prompts (11 prompts)
```

---

## 4. Route Structure

| Route | Type | Description | Auth |
|-------|------|-------------|------|
| `/` | ƒ Dynamic | Homepage (hero, categories, contact, JSON-LD) | Public |
| `/menu` | ƒ Dynamic | Full menu with search + category filter | Public |
| `/menu/[slug]` | ƒ Dynamic | Dish detail page (async params) | Public |
| `/cart` | ○ Static | Cart review + checkout form | Public |
| `/order/confirmation/[reference]` | ƒ Dynamic | Order receipt after COD | Public |
| `/admin/login` | ○ Static | Staff email/password login | Public |
| `/admin` | ƒ Dynamic | Order dashboard (paginated, searchable, Realtime) | Staff |
| `/admin/menu` | ƒ Dynamic | Menu CRUD + Cloudinary upload | Staff |
| `/admin/orders/[id]` | ƒ Dynamic | Single order detail + status controls | Staff |
| `/admin/reports` | ƒ Dynamic | Revenue reports (Today/Week/Month/Year + custom) | Staff |
| `/sitemap.xml` | ƒ Dynamic | Dynamic sitemap (pages + category anchors) | Public |
| `/robots.txt` | ○ Static | Robots exclusion rules | Public |
| `/_not-found` | ○ Static | Internal Next.js not-found fallback | Public |

> **Key**: ƒ = server-rendered on demand (dynamic), ○ = pre-rendered (static)

---

## 5. Database Schema (Supabase PostgreSQL)

### 5.1 categories
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| name | text | NOT NULL |
| display_order | integer | NOT NULL, default 0 |
| created_at | timestamptz | NOT NULL, default now() |

### 5.2 menu_items
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| category_id | uuid | FK → categories.id, NOT NULL |
| name | text | NOT NULL |
| description | text | NOT NULL, default '' |
| price | numeric(10,2) | NOT NULL, CHECK (> 0) |
| image_url | text | nullable |
| is_available | boolean | NOT NULL, default true |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### 5.3 orders
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| reference_number | text | UNIQUE, NOT NULL (RDC-XXXXXXXX) |
| customer_name | text | NOT NULL |
| customer_phone | text | NOT NULL |
| delivery_address | text | NOT NULL |
| notes | text | nullable |
| payment_status | text | CHECK: cod_pending, cancelled |
| order_status | text | CHECK: pending, preparing, ready, completed, cancelled |
| total_amount | numeric(10,2) | NOT NULL |
| created_at | timestamptz | default now() |

### 5.4 order_items
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| order_id | uuid | FK → orders.id, ON DELETE CASCADE |
| menu_item_id | uuid | FK → menu_items.id, nullable |
| item_name_snapshot | text | NOT NULL |
| item_price_snapshot | numeric(10,2) | NOT NULL |
| quantity | integer | NOT NULL, CHECK (> 0) |

### 5.5 profiles
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, FK → auth.users(id) |
| role | text | CHECK: staff, admin |
| name | text | NOT NULL |
| created_at | timestamptz | default now() |

### 5.6 Status State Machine
```
pending ──→ preparing ──→ ready ──→ completed
    │            │           │
    └─── cancelled ──────────┘
```
- `completed` and `cancelled` are terminal (no transitions out)
- Staff can cancel at pending, preparing, or ready

---

## 6. Security Model

| Layer | Mechanism |
|-------|-----------|
| RLS (public) | categories: read-only; menu_items: read-only WHERE is_available=true; orders: insert-only; order_items: insert-only |
| RLS (staff) | All tables: full access when authenticated as staff/admin via profiles.role |
| Middleware | `src/proxy.ts` — checks Supabase session + profiles.role on ALL /admin routes; redirects to /admin/login if unauthorized |
| Server Actions | Every action calls `requireStaff()` from `src/lib/supabase/admin-auth.ts` which validates auth + role server-side |
| Rate Limiting | `create-order.ts` — 60-second cooldown per phone number |
| Service Role | Server actions use `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS for staff operations) |

---

## 7. Milestone Progress (62 Tasks Total)

| Milestone | Tasks | Status |
|-----------|-------|--------|
| **M1** — Project Scaffold | T001-T006 | 5/6 done [T006: manual deploy] |
| **M2** — Static Homepage | T007-T010 | 4/4 done |
| **M3** — Static Menu UI | T011-T013 | 3/3 done |
| **M4** — Supabase Schema + Live Data | T014-T021 | 8/8 done |
| **M5** — Search & Category Filtering | T022-T024 | 3/3 done |
| **M6** — Food Detail View | T025-T027 | 3/3 done |
| **M7** — Cart with Zustand | T028-T030 | 3/3 done |
| **M8** — COD Checkout | T031-T036 | 6/6 done |
| **M9** — Staff Authentication | T037-T041 | 4/5 done [T041: manual user creation] |
| **M10** — Admin Menu Management | T042-T047 | 5/6 done [T047: manual verify] |
| **M11** — Admin Order Dashboard | T048-T053 | 6/6 done |
| **M12** — Admin Reports | T054-T056 | 2/3 done [T056: manual verify] |
| **M13** — SEO, Error Pages & Deployment | T057-T062 | 5/6 done [T062: manual deploy] |
| **Total** | **62 tasks** | **57 done, 5 manual/pending** |

### Pending Tasks (5)
- T006: Deploy to Vercel preview (manual)
- T041: Create staff user in Supabase Auth (manual)
- T047: Verify admin menu CRUD reflects on public menu (manual)
- T056: Verify reports against DB (manual)
- T062: Final production deployment + Google Rich Results test (manual)

---

## 8. Bugs Fixed

### Bug 1: Realtime Subscription Tear-down
- **File**: `src/components/shared/admin-order-dashboard.tsx`
- **Root Cause**: Realtime `useEffect` depended on `[audioUnlocked]`. Jab "Enable Alerts" click hota, `audioUnlocked` false→true hota, effect cleanup `supabase.removeChannel(channel)` chalata phir naya subscribe karta. Is brief gap mein INSERT events miss ho jate.
- **Fix**: Dependency `[audioUnlocked]` → `[]`, `audioUnlockedRef` ref use kiya callback mein. Subscription ab sirf mount/unmount par recreate hota hai.
- **Related**: Added `useEffect` to sync `audioUnlockedRef.current = audioUnlocked` separately.

### Bug 2: Hydration Mismatch (Date Formatting)
- **File**: `src/components/shared/receipt.tsx` (primary)
- **Root Cause**: `new Date(createdAt).toLocaleString()` bina locale/options. Server (Node.js ICU) aur browser ka default locale alag → different output strings → hydration mismatch.
- **Fix**: Replaced with `toLocaleString("en-GB", { day, month, year, hour, minute, hour12: false })` in 3 files: `receipt.tsx`, `admin-order-detail.tsx`, `admin-order-dashboard.tsx`. Har jagah explicit `en-GB` + `hour12: false`.

### Bug 3: Timezone Bug in Reports (PKT vs UTC)
- **File**: `src/actions/get-reports.ts`
- **Root Cause**: `new Date().setHours(0,0,0,0)` server ke default timezone (UTC) par midnight set karta hai, jabke restaurant Pakistan Standard Time (UTC+5) mein hai. Isliye "Today" ka count local (PKT) aur production (UTC) mein mismatch tha.
- **Fix**: Added `PKT_OFFSET = 5 * 3600000`, `toPKT()` aur `fromPKT()` helpers. Saare date boundaries (Today, Week, Month, Year, Custom Range, Month Select) ab PKT timezone mein calculate hote hain phir UTC mein convert hote hain.

### Bug 4: N+1 Query in Menu Detail
- **File**: `src/app/menu/[slug]/page.tsx`
- **Root Cause**: Menu item aur category name ke liye 2 alag queries chal rahi thin (pehle item fetch, phir category by id).
- **Fix**: Single join query: `.select("id, name, description, price, image_url, is_available, categories(name)")`. Ab 1 round trip.

### Bug 5: SELECT * Everywhere
- **Root Cause**: Multiple files `.select("*")" kar rahe the — unnecessary columns fetch ho rahe the (orders, order_items, menu_items, categories).
- **Fix**: 6 files fixed to select only needed columns. Changed `select("*")" → specific column lists.

---

## 9. Features Implemented (by Milestone)

### M1: Project Scaffold
- Next.js 16 + TypeScript + Tailwind v4 initialized
- Warm/wooden theme tokens (amber, brown, cream) in globals.css
- Restaurant favicon (icon.svg)
- Root layout with Geist font
- robots.ts with sitemap link

### M2: Static Homepage
- HeroSection component (gradient background, brand tagline)
- CategoryTiles (grid of clickable category links)
- Contact/Location section with placeholder text

### M3: Static Menu UI
- MenuItemCard (image, name, description, price, add-to-cart)
- Hardcoded mock data (replaced in M4)
- Cross-route anchor navigation (/menu#<slug>)

### M4: Supabase + Live Data
- 5 migrations: categories, menu_items, orders, order_items, profiles
- RLS policies on every table
- Browser + server Supabase clients
- CategoryTiles + Menu page connected to live data
- Seed data (5-8 categories, 15-20 items)

### M5: Search & Category Filter
- Text search input (filters name/description client-side)
- Category filter buttons (toggle selected category)
- Combined search + filter (both active simultaneously)

### M6: Food Detail View
- Dynamic route menu/[slug] with async params
- Single item fetch with join query (includes category name)
- AddToCartButton wired to Zustand store

### M7: Cart
- Zustand store with actions: addItem, removeItem, updateQuantity, clearCart
- Cart page (review, quantity controls, subtotal)
- Cart badge in site header

### M8: COD Checkout
- Zod checkout schema (name, phone, address, notes, items array)
- create-order server action (validate, rate-limit, generate RDC-XXXXXXXX, insert order + items)
- React Hook Form in cart page
- Receipt component (itemized table, totals, print button)
- Order confirmation page (by reference number)

### M9: Staff Authentication
- Login page (email/password via Supabase Auth)
- requireStaff() helper (checks auth + role)
- Middleware protecting all /admin routes
- Admin layout (sidebar, user info, logout)

### M10: Admin Menu Management
- Zod schemas for category + menu item validation
- Server actions: create/update/delete category with orphan protection
- Server actions: create/update/delete/toggle menu item
- Cloudinary signed upload for images
- Full CRUD UI with category list + item list per category

### M11: Admin Order Dashboard
- Paginated order list (20 per page, server-side)
- Server-side search by customer name/phone (ilike)
- Status transition controls (legal state machine)
- Supabase Realtime subscription for new orders (toast + audio beep)
- Single order detail page with receipt print

### M12: Admin Reports
- Aggregate queries for Today/Week/Month/Year (excludes cancelled)
- Custom date range filter (From/To date inputs)
- Month quick-select (dropdown + year)
- Validation: from > to error message
- All in PKT timezone (fixes UTC mismatch)

### M13: SEO, Error Pages & Deployment
- Metadata API on all 5 public pages
- JSON-LD Restaurant schema (name, cuisine, address)
- Dynamic sitemap.xml (pages + category anchors)
- OG tags in layout metadata
- Alt text audit (all images descriptive)
- Custom 404 page (warm theme, Back to Home link)
- Custom error boundary (500 page, Try Again button)
- All dynamic routes verified: params: Promise + await params

---

## 10. Server Actions (6 total)

| Action | File | Purpose | Auth | Rate Limited |
|--------|------|---------|------|-------------|
| `createOrder` | `create-order.ts` | Create order + order_items, validate, generate reference | Public | Yes (60s/phone) |
| `updateOrderStatus` | `update-order-status.ts` | Transition order status (state machine) | Staff | No |
| `createCategory` | `manage-category.ts` | Create category | Staff | No |
| `updateCategory` | `manage-category.ts` | Update category | Staff | No |
| `deleteCategory` | `manage-category.ts` | Delete category (orphan check) | Staff | No |
| `getCategories` | `manage-category.ts` | List all categories (for admin) | Staff | No |
| `createMenuItem` | `manage-menu-item.ts` | Create menu item | Staff | No |
| `updateMenuItem` | `manage-menu-item.ts` | Update menu item | Staff | No |
| `deleteMenuItem` | `manage-menu-item.ts` | Delete menu item | Staff | No |
| `toggleMenuItem` | `manage-menu-item.ts` | Toggle is_available | Staff | No |
| `getMenuItemsForCategory` | `manage-menu-item.ts` | List items by category (for admin) | Staff | No |
| `getAllMenuItems` | `manage-menu-item.ts` | List all items (for admin) | Staff | No |
| `getCloudinarySignature` | `get-cloudinary-signature.ts` | Generate signed upload params | Staff | No |
| `getReports` | `get-reports.ts` | Aggregate orders for 4 periods | Staff | No |
| `getCustomRangeReport` | `get-reports.ts` | Aggregate orders for custom date range | Staff | No |
| `getMonthRangeReport` | `get-reports.ts` | Aggregate orders for a specific month | Staff | No |

---

## 11. Key Architectural Decisions

1. **src/ directory** — All app code under src/, not root (cleaner separation)
2. **Service Role for Staff** — Server actions use SUPABASE_SERVICE_ROLE_KEY (bypass RLS) instead of individual staff sessions for writes — simpler, but means staff auth is handled at the application layer via requireStaff()
3. **Client-side search** — Menu search is client-side (filter already-fetched data) because data volume is small (cafe menu, not Amazon)
4. **Server-side order search** — Admin order search is server-side (ilike query) because orders can grow large
5. **Zustand over Context** — Cart uses Zustand (simpler API, no provider, built-in persist middleware)
6. **No next/image** — Using plain <img> tags (simpler, Cloudinary already optimizes images)
7. **force-dynamic** — All public pages use force-dynamic (data changes frequently for a restaurant)
8. **PKT timezone** — Reports use explicit UTC+5 offset, not server's default timezone
9. **Base UI** — shadcn/ui uses @base-ui/react instead of Radix (Next.js 16 compatibility)
10. **Tailwind v4** — Uses Tailwind CSS v4 (not v3), which uses @tailwindcss/postcss instead of postcss-import

---

## 12. Environment Variables Required

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Anon/publishable key (client-safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only, for admin operations) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret (for signed uploads) |

---

## 13. Total File Count

| Category | Count |
|----------|-------|
| Root config files | ~15 |
| `src/` .ts/.tsx files | **52** |
| `specs/` files | 8 |
| `supabase/` files | 8 |
| `history/prompts/` | 11 |
| `public/` | 5 |
| `.opencode/` | ~14 |
| `.specify/` | ~13 |
| **Total source files** | **~126** |

---

## 14. What Remains (Manual Steps)

1. **Deploy to Vercel** (T006) — initial preview deploy
2. **Create staff user** (T041) — run `supabase/migrations/../create-staff-user.sql` or use Supabase dashboard
3. **Verify admin CRUD** (T047) — add category, add item with image, toggle off, check public menu
4. **Verify reports** (T056) — insert test order, check today's numbers, cancel order, confirm excluded
5. **Final production deploy** (T062) — deploy to Vercel, verify dynamic routes, JSON-LD validation via Google Rich Results Test, test 404 page

---

## 15. Git History (Most Recent)

```
eb9112e  updated-finailize-project
c97c3dc  updated-report-page
4bac38d  add_reports_feature
21c41e3  add_order_feature
5aa0459  add_admin-page
a33f926  add_add-to-cart_feature
594e79c  add_dynamic_page_for_dishes
9f9d3cd  add_search_feature
ff031cf  updated
bf803e5  code_push
```
