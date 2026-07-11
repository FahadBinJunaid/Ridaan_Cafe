# Tasks: Restaurant Ordering Website — Rindaan Cafe & Cuisine

**Input**: Design documents from `specs/001-restaurant-ordering/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/server-actions.md, research.md

**Milestone structure**: 13 sequential milestones. Each milestone is
independently testable and must be verified before starting the next.

## Format: `[ID] [P?] [M#] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[M#]**: Milestone number (M1–M13)
- Include exact file paths in descriptions

---

## Milestone 1 — Project Scaffold

**Goal**: Next.js 16 + TypeScript + Tailwind + shadcn/ui initialized with
warm/wooden design tokens and favicon.

**Done**: Runs locally and on Vercel preview with a styled placeholder
homepage.

- [x] T001 [P] [M1] Configure warm/wooden theme tokens in
  `src/app/globals.css` (amber, brown, cream colour palette)
- [x] T002 [P] [M1] Add a restaurant-themed favicon as
  `src/app/icon.svg`
- [x] T003 [M1] Set up root layout with Geist font (from create-next-app)
  and base metadata in `src/app/layout.tsx`
- [x] T004 [M1] Update `src/app/page.tsx` with a styled placeholder
  homepage ("Rindaan Cafe & Cuisine" hero with tagline)
- [x] T005 [M1] Configure `src/app/robots.ts` with initial sitemap link
- [ ] T006 [M1] Deploy to Vercel preview and confirm the styled
  placeholder renders (manual step)

---

## Milestone 2 — Static Homepage

**Goal**: Hero section, category tiles (hardcoded mock data), and
Contact/Location section with placeholder values.

**Done**: Homepage displays correctly and responsively on mobile and
desktop with mock data.

- [x] T007 [P] [M2] Create `src/components/shared/hero-section.tsx` with
  restaurant branding heading, tagline, and warm background
- [x] T008 [P] [M2] Create `src/components/shared/category-tiles.tsx`
  with hardcoded mock categories (Starters, Fast Food, Chai, etc.)
  rendered as interactive tile cards
- [x] T009 [P] [M2] Create Contact/Location section inline in
  `src/app/page.tsx` with clearly marked placeholder text:
  `[Restaurant Name]`, `[Address]`, `[Phone]`, `[Hours]`
- [x] T010 [M2] Assemble homepage in `src/app/page.tsx`: hero →
  category-tiles → contact section; verify responsive on mobile +
  desktop

---

## Milestone 3 — Static Full Menu UI

**Goal**: Category-by-category listing and "Full Menu" scroll view using
hardcoded mock JSON data.

**Done**: Menu displays correctly and responsively using fake data.

- [x] T011 [P] [M3] Create `src/components/shared/menu-item-card.tsx`
  showing item name, description, price, and placeholder image
- [x] T012 [M3] Create `src/app/menu/page.tsx` rendering all categories
  in sequence with their menu items from a hardcoded mock JSON array;
  each section has `id="<slug>"` matching category tile links from
  homepage (`/menu#<slug>`), enabling cross-route anchor navigation
- [x] T013 [M3] Verify responsive layout on mobile and desktop:
  category headings + item cards aligned correctly

---

## Milestone 4 — Supabase Schema + Live Data

**Goal**: All database tables created with RLS policies (defined in same
step), homepage and menu connected to live Supabase data.

**Done**: Homepage and menu render real data from Supabase; RLS manually
confirmed — public can read menu_items/categories but cannot write.

- [x] T014 [M4] Create Supabase migration: table `categories` with
  columns `id (uuid PK)`, `name (text)`, `display_order (int)`,
  `created_at (timestamptz)`; define RLS policies: public read-only,
  staff full access
- [x] T015 [M4] Create Supabase migration: table `menu_items` with
  columns `id (uuid PK)`, `category_id (uuid FK)`, `name (text)`,
  `description (text)`, `price (numeric)`, `image_url (text nullable)`,
  `is_available (boolean default true)`, `created_at`, `updated_at`;
  define RLS: public read-only (filtered by is_available), staff full
  access
- [x] T016 [M4] Create Supabase migration: tables `orders` (columns per
  data-model.md) and `order_items` (columns per data-model.md); define
  RLS: public insert-only, staff full read/update
- [x] T017 [M4] Create Supabase migration: table `profiles` with
  `id (uuid PK FK)`, `role (text)`, `name (text)`, `created_at`;
  define RLS: staff full access only
- [x] T018 [P] [M4] Create `src/lib/supabase/client.ts` — browser
  Supabase client using `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- [x] T019 [M4] Update `src/components/shared/category-tiles.tsx` to
  fetch categories from Supabase (real data instead of mock) and
  refetch on mount
- [x] T020 [M4] Update `src/app/menu/page.tsx` to fetch menu_items
  (with joined category) from Supabase instead of mock JSON; only
  items where `is_available = true`
- [x] T021 [M4] Seed the database with 5–8 sample categories and
  15–20 sample menu items; manually test RLS — confirm an anonymous
  API call to `POST /rest/v1/menu_items` returns 401

---

## Milestone 5 — Search & Category Filtering

**Goal**: Text search across menu items and category filter buttons on
the live menu page.

**Done**: Filtering and search work on the menu page, updating the UI
without a full page reload.

- [ ] T022 [M5] Add a text search input to `src/app/menu/page.tsx` that
  filters displayed menu items by matching `name` or `description`
  client-side from the already-fetched data
- [ ] T023 [M5] Add category filter buttons/links above the menu items
  that toggle a selected category and show only matching items
- [ ] T024 [M5] Combine search + category filter so both can be active
  simultaneously; verify zero console errors

---

## Milestone 6 — Food Detail View

**Goal**: Dynamic route for individual menu item using Next.js 16 async
params pattern.

**Done**: Detail view shows correct data per item; add-to-cart works
from it.

- [ ] T025 [M6] Create `src/app/menu/[slug]/page.tsx` with
  `params: Promise<{ slug: string }>` — await params, fetch single
  `menu_items` row by id, render name/description/price/image and
  "Add to Cart" button
- [ ] T026 [M6] Generate search-engine-friendly slugs or use item UUID
  as the route param; wire up navigation from `menu-item-card.tsx`
- [ ] T027 [M6] Verify dynamic route works on production build: test
  `next build && next start` with a real item URL

---

## Milestone 7 — Cart with Zustand

**Goal**: Client-side cart using Zustand.

**Done**: Cart state correctly persists across navigation during the
session.

- [ ] T028 [P] [M7] Create `src/lib/store/cart.ts` — Zustand store with
  actions: `addItem`, `removeItem`, `updateQuantity`, `clearCart`, and
  computed `subtotal`
- [ ] T029 [M7] Create `src/app/cart/page.tsx` — cart review page
  showing item list, quantity controls, remove button, and subtotal
- [ ] T030 [M7] Wire "Add to Cart" button in detail view
  (`src/app/menu/[slug]/page.tsx`) and menu-item cards to the Zustand
  store; add a cart badge/indicator in the site header

---

## Milestone 8 — COD Checkout

**Goal**: Checkout form with Zod validation creates order + order_items
rows, shows confirmation with printable receipt.

**Done**: A real order appears correctly in the database; invalid
submissions are blocked; receipt shows correct details and can be
printed.

- [ ] T031 [P] [M8] Create `src/lib/schemas/checkout.ts` — Zod schema
  for `customer_name`, `customer_phone`, `delivery_address`,
  `notes?`, and `items` array (shared between client and server)
- [ ] T032 [M8] Create `src/actions/create-order.ts` — server action:
  validate with checkoutSchema, generate `RDC-XXXXXXXX` reference
  number, compute `total_amount`, rate-limit check (60s per phone),
  insert orders + order_items rows, return `{ reference_number }`
- [ ] T033 [M8] Create `src/lib/supabase/server.ts` — server client
  using `SUPABASE_SERVICE_ROLE_KEY` for admin write operations
- [ ] T034 [M8] Build checkout form in `src/app/cart/page.tsx` using
  React Hook Form with shared checkoutSchema; customer name, phone,
  delivery address, optional notes fields; submit button disabled
  after first click to prevent duplicates
- [ ] T035 [M8] Create `src/components/shared/receipt.tsx` — reusable
  receipt component showing order reference, itemised list, total, and
  a "Print" button using `window.print()`
- [ ] T036 [M8] Create `src/app/order/confirmation/[reference]/page.tsx`
  with `params: Promise<{ reference: string }>` — fetch order +
  order_items by reference_number, render receipt, enable print

---

## Milestone 9 — Staff Authentication

**Goal**: Supabase Auth login, profiles role check, middleware
protecting `/admin` routes.

**Done**: Unauthenticated users cannot reach any `/admin` route.

- [ ] T037 [P] [M9] Create `src/app/(admin)/admin/login/page.tsx` —
  email/password login form using Supabase Auth
- [ ] T038 [M9] Create `src/middleware.ts` — check for authenticated
  session and valid `profiles.role` on all `/admin` routes; redirect
  to `/admin/login` if missing
- [ ] T039 [M9] Create `src/app/(admin)/admin/layout.tsx` — admin
  layout with sidebar navigation (Dashboard, Menu, Orders, Reports),
  user info, logout button
- [ ] T040 [M9] Create `src/app/(admin)/admin/page.tsx` — admin
  dashboard placeholder (will become the order list in M11)
- [ ] T041 [M9] Create a staff user in Supabase Auth and matching
  `profiles` row (`role = 'staff'`); verify that logging in grants
  access to `/admin` and logging out redirects to `/admin/login`

---

## Milestone 10 — Admin Menu Management

**Goal**: Category CRUD and menu-item CRUD with Cloudinary image upload.

**Done**: Staff can add a new dish with a real uploaded image; it
appears (or disappears, if unavailable) on the public menu immediately
without a deployment.

- [ ] T042 [P] [M10] Create `src/lib/schemas/category.ts` and
  `src/lib/schemas/menu-item.ts` — Zod schemas for category and menu
  item create/update validation
- [ ] T043 [M10] Create `src/actions/manage-category.ts` — server
  actions for create, update, delete with orphan protection (block
  deletion if items exist); staff-only auth
- [ ] T044 [M10] Create `src/actions/manage-menu-item.ts` — server
  actions for create, update, delete, toggle-availability; staff-only
  auth
- [ ] T045 [P] [M10] Create `src/actions/get-cloudinary-signature.ts` —
  server action generating signed upload params using
  `CLOUDINARY_API_SECRET`; staff-only auth
- [ ] T046 [M10] Create `src/app/(admin)/admin/menu/page.tsx` —
  admin menu management UI: category list (add/edit/delete with orphan
  check), menu item list per category (add/edit/delete/toggle), image
  upload widget that calls get-cloudinary-signature then uploads
  directly to Cloudinary
- [ ] T047 [M10] Verify: add a new category, add a menu item with
  uploaded image, toggle off — confirm public menu reflects changes
  immediately

---

## Milestone 11 — Admin Order Dashboard

**Goal**: Live order list with status updates, search, pagination,
receipt printing, and Realtime new-order alerts.

**Done**: Staff can manage orders; search finds correct orders;
pagination works past 20 orders; newly placed order appears with
alert without manual refresh.

- [ ] T048 [P] [M11] Create `src/actions/update-order-status.ts` —
  server action validating legal state transition per data-model.md
  state machine; staff-only auth
- [ ] T049 [M11] Build order list in
  `src/app/(admin)/admin/page.tsx`: fetch orders newest-first with
  server-side pagination (20 per page), rendered in a table with
  customer name, phone, status, total, created_at
- [ ] T050 [M11] Add server-side search by `customer_name` or
  `customer_phone` to the order list query
- [ ] T051 [M11] Add status transition controls (dropdown/buttons) to
  each order row calling `update-order-status`; refresh list on update
- [ ] T052 [M11] Wire Supabase Realtime subscription on `orders` table
  INSERT events: add new orders to the top of the list, show a toast
  notification, play an audio alert (audio unlocked after first user
  click on the page)
- [ ] T053 [M11] Create `src/app/(admin)/admin/orders/[id]/page.tsx`
  with `params: Promise<{ id: string }>` — single order detail with
  item list, status controls, and receipt print button reusing
  `receipt.tsx`

---

## Milestone 12 — Admin Reports

**Goal**: Today/week/month/year order counts and revenue (cancelled
excluded).

**Done**: Reports numbers match a manual count/sum of actual orders in
the database for each period.

- [ ] T054 [M12] Create `src/actions/get-reports.ts` — server action
  querying aggregate order counts and `SUM(total_amount)` for today,
  this week (ISO week), this month, and this year; filter out
  `order_status = 'cancelled'`
- [ ] T055 [M12] Create `src/app/(admin)/admin/reports/page.tsx` —
  reports page displaying four period cards (Today, This Week, This
  Month, This Year) each showing order count and total revenue
- [ ] T056 [M12] Manually verify against database: insert a test order,
  confirm it appears in today's numbers; cancel an order, confirm it
  is excluded from revenue

---

## Milestone 13 — SEO, Error Pages & Deployment

**Goal**: Metadata API, JSON-LD, sitemap, OG tags, alt text audit,
custom not-found/error pages, final production deployment.

**Done**: Site is live; structured data validates in Google's Rich
Results test; broken URL shows custom 404 instead of framework default.

- [ ] T057 [P] [M13] Add full Metadata API exports to all public pages:
  `src/app/layout.tsx` (base), `src/app/page.tsx`,
  `src/app/menu/page.tsx`, `src/app/menu/[slug]/page.tsx`,
  `src/app/cart/page.tsx`
- [ ] T058 [P] [M13] Add Restaurant JSON-LD structured data to
  `src/app/page.tsx` homepage using `ld+json` script tag
- [ ] T059 [P] [M13] Create `src/app/sitemap.ts` generating sitemap.xml
  with all public page URLs (homepage, menu, all category anchors via
  Supabase query)
- [ ] T060 [P] [M13] Audit all images across public pages for
  descriptive `alt` text; add Open Graph tags to layout metadata
- [ ] T061 [P] [M13] Create `src/app/not-found.tsx` (custom 404) and
  `src/app/error.tsx` (custom error boundary), both styled consistently
  with the warm/wooden theme
- [ ] T062 [M13] Final production deployment to Vercel: verify dynamic
  routes (`/menu/[slug]`, `/order/confirmation/[reference]`,
  `/admin/orders/[id]`) work with async params on production build;
  verify JSON-LD validates in Google Rich Results Test; confirm
  visiting a nonexistent URL shows the custom 404 page

---

## Dependencies & Execution Order

### Milestone Dependencies

- **M1** (Scaffold): No dependencies — can start immediately
- **M2** (Static Homepage): Depends on M1
- **M3** (Static Menu): Depends on M1
- **M4** (Supabase + Live Data): Depends on M2, M3 (replaces mock data)
- **M5** (Search/Filter): Depends on M4
- **M6** (Food Detail): Depends on M4
- **M7** (Cart): Depends on M1 (standalone Zustand store)
- **M8** (Checkout): Depends on M4, M7
- **M9** (Auth): Depends on M4 (profiles table must exist)
- **M10** (Menu Management): Depends on M4, M9
- **M11** (Order Dashboard): Depends on M8, M9
- **M12** (Reports): Depends on M8 (orders must exist to report on)
- **M13** (SEO/Deploy): Depends on all prior milestones complete

### Parallel Opportunities Within Each Milestone

Tasks marked **[P]** in the same milestone can run in parallel.

### Implementation Strategy

1. Complete M1 → M13 sequentially; do not skip or reorder.
2. After each milestone, verify its **Done** criteria before starting
   the next.
3. Run `npm run dev` after each milestone to catch build errors early.
4. Deploy to Vercel preview after M1 and M13; intermediate milestones
   can be verified locally.

## Notes

- Each milestone is independently testable per its **Done** criteria.
- No feature from a later milestone is pre-built in an earlier one.
- The Zustand cart (M7) is initially standalone and only integrated
  with the checkout flow in M8.
- RLS policies are defined in the same migration step as each table
  (M4) — never deferred, per spec requirements.
- Dynamic routes use `params: Promise<...>` with `await params`
  (Next.js 16 async convention).
