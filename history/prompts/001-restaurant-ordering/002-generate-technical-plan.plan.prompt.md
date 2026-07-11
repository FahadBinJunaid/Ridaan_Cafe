---
id: 002
title: generate-technical-plan
stage: plan
date: 2026-07-11
surface: agent
model: deepseek-v4-flash-free
feature: 001-restaurant-ordering
branch: 001-restaurant-ordering
user: FahadBinJunaid
command: /sp.plan
labels: ["plan", "architecture", "restaurant-ordering", "data-model", "server-actions"]
links:
  spec: specs/001-restaurant-ordering/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-restaurant-ordering/plan.md
  - specs/001-restaurant-ordering/research.md
  - specs/001-restaurant-ordering/data-model.md
  - specs/001-restaurant-ordering/quickstart.md
  - specs/001-restaurant-ordering/contracts/server-actions.md
tests:
  - null
---

## Prompt

Generate a complete plan.md translating the finalized spec.md for "Rindaan Cafe & Cuisine" into technical architecture. Reference and remain consistent with spec.md; do not introduce new features or tools. Infrastructure limited to Supabase, Cloudinary, Vercel. The project uses Next.js 16 — all dynamic route params and searchParams are async and must be awaited before use; do not generate architecture assuming the older synchronous params pattern.

DATABASE SCHEMA — conceptual level, not raw SQL:
- categories: id, name, display_order, created_at
- menu_items: id, category_id (FK), name, description, price, image_url (Cloudinary), is_available (boolean), created_at, updated_at
- orders: id, customer_name, customer_phone, delivery_address, notes (nullable), payment_status (enum: cod_pending, cancelled), order_status (enum: pending, preparing, ready, completed, cancelled), total_amount, created_at
- order_items: id, order_id (FK), menu_item_id (FK), item_name_snapshot, item_price_snapshot, quantity — snapshotted at order time so later menu edits never alter historical orders
- profiles: id (matches Supabase auth user id), role (enum: staff, admin), name

RLS ACTIVATION NOTE:
- The Supabase project has "automatic RLS on table creation" enabled — every new table gets RLS enabled by default the moment it's created. This means RLS policies must be defined in the same step as table creation for every table listed above; a table left with RLS on but no policies blocks all access, including legitimate public reads and staff writes.

ENVIRONMENT VARIABLE NAMING (exact, do not substitute other names):
- NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, SUPABASE_SERVICE_ROLE_KEY for Supabase; NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET for Cloudinary. Supabase client setup (browser and server) must reference NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, not the older "anon key" naming.

FOLDER STRUCTURE:
- Next.js App Router: public storefront routes fully separate from an isolated /admin route group (dashboard, order management, menu management, reports), protected by middleware checking for an authenticated session with a valid profiles role.
- Define where Zod schemas, Supabase client instances (browser + server), the Zustand cart store, and the Cloudinary upload helper live.

PUBLIC ORDER FLOW LOGIC:
- Cart state (Zustand) -> checkout form validated with Zod -> server action creates one orders row and corresponding order_items rows -> on-screen confirmation with a printable/downloadable receipt.

MENU MANAGEMENT LOGIC:
- Define the category CRUD flow (create/edit/reorder/delete) and menu-item CRUD flow (create/edit/delete/toggle availability), including how an admin-side Cloudinary image upload is wired into the menu-item create/edit form (client uploads directly to Cloudinary via a signed upload, then stores the returned URL in menu_items.image_url — the image file itself never passes through the Next.js server).
- Define that deleting a category with existing menu items is either blocked or requires reassigning those items first — do not allow silent orphaning of menu_items.

REALTIME NOTIFICATION LOGIC:
- Define how the admin dashboard subscribes to a Supabase Realtime channel on the orders table's INSERT event, updates the order list live, and shows a visual + audio alert, noting the audio-unlock-after-first-interaction browser requirement.

ORDER LIST SEARCH & PAGINATION LOGIC:
- Define server-side pagination (e.g. 20 orders per page) and a search query against customer_name/customer_phone, so the dashboard never loads the full order history at once.

REPORTS LOGIC:
- Define the aggregate queries for today/week/month/year order count and revenue (SUM of total_amount, COUNT), excluding order_status = cancelled.

AUTH BOUNDARY:
- Storefront: fully public. /admin (dashboard, menu management, reports): requires authenticated session with staff/admin role.

ROUTING NOTE:
- Any dynamic route (e.g. food detail pages, individual admin order views) must define params as a Promise and await it before use, per Next.js 16 conventions.

ERROR HANDLING:
- Define a custom not-found.tsx and a custom error.tsx at the app root, styled consistently with the site's theme rather than left as framework defaults.

DEPLOYMENT:
- Vercel with preview deployments per branch, production on merge to main. Environment variables (as named above) configured in Vercel project settings, marked public vs server-only.

Write plan.md as an architecture and data-flow document — no code. Self-contained.

## Response snapshot

Created full implementation plan at `specs/001-restaurant-ordering/plan.md` covering Technical Context (TypeScript/Next.js 16/Supabase/Cloudinary), Constitution Check (all 6 principles PASS), and Project Structure (full directory tree). Phase 0 research.md resolves 7 architectural questions (Realtime channels, Cloudinary signed-upload, async params, RLS, rate-limiting, audio-unlock, error pages). Phase 1 data-model.md defines all 5 entities with columns, constraints, RLS, Zod validation, and order status state machine. Contracts at contracts/server-actions.md detail 5 server actions (create-order, update-order-status, manage-category, manage-menu-item, get-cloudinary-signature) with input/output/error contracts. quickstart.md provides setup, env vars, key URLs, deployment steps, and verification checklist. Agent context updated in AGENTS.md.

## Outcome

- ✅ Impact: Complete technical architecture documented — no NEEDS CLARIFICATION markers, all constitution gates pass
- 🧪 Tests: null
- 📁 Files: 5 (plan.md, research.md, data-model.md, quickstart.md, contracts/server-actions.md)
- 🔁 Next prompts: Task breakdown via /sp.tasks
- 🧠 Reflection: All user-specified constraints (async params, env var naming, RLS at creation time, public/admin separation, snapshot pattern for order_items) incorporated faithfully.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): none
