---
id: 001
title: generate-restaurant-ordering-spec
stage: spec
date: 2026-07-11
surface: agent
model: deepseek-v4-flash-free
feature: 001-restaurant-ordering
branch: 001-restaurant-ordering
user: FahadBinJunaid
command: /sp.specify
labels: ["spec", "restaurant-ordering", "website", "rindaan-cafe", "menu", "admin-dashboard"]
links:
  spec: specs/001-restaurant-ordering/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-restaurant-ordering/spec.md
  - specs/001-restaurant-ordering/checklists/requirements.md
tests:
  - null
---

## Prompt

Generate a complete spec.md for "Rindaan Cafe & Cuisine" — a premium Pakistani Dhaba-style restaurant ordering website with a modern, warm, wooden-texture aesthetic, located in Karachi, Sindh.

TECH STACK (fixed, do not suggest alternatives, do not add anything beyond this list):
- Next.js 16, App Router, TypeScript
- Tailwind CSS + shadcn/ui for components
- Framer Motion for hero/card micro-animations only (used sparingly)
- React Hook Form + Zod for all forms and validation
- Supabase for database, authentication, file storage, and Realtime (live updates)
- Cloudinary for food image hosting, on-the-fly resizing, and admin-side image uploads
- Zustand for cart state only
- Vercel for hosting/deployment
No error-tracking, analytics, SMS, email, or payment-gateway service is used in this version. Infrastructure is limited to Supabase, Cloudinary, and Vercel.

PUBLIC-FACING FUNCTIONAL SCOPE:
- No customer accounts. Guest browsing only.
- Homepage: hero section with restaurant branding, a row of category tiles (e.g. Starters, Fast Food, Chai, Pasta/Chinese, Pizzeria, Barbeque, Dessert — pulled dynamically from the categories table, not hardcoded), and a Contact/Location section showing restaurant name, address, phone number, and operating hours (use clearly marked placeholder text for these values — the client will supply the real address, phone, and hours before launch; do not invent real-looking contact details).
- Clicking a category tile jumps to that category's section in the menu. A separate "Full Menu" view shows every category in sequence on one scrollable page.
- Menu browsing with text search and category filtering.
- Food detail view: description, price, image, add-to-cart.
- Cart: add/remove items, adjust quantity, view subtotal (client-side only, Zustand).
- Single checkout path: name, phone, delivery address, optional notes. Payment is Cash on Delivery only. Submitting creates an order in the database with payment_status = "cod_pending".
- On-screen order confirmation immediately after submission (order reference number, itemized list, total) with a "Download/Print Receipt" option. This is the customer's only order notification — no email/SMS confirmation exists, since there is no customer account or verified contact channel.

ADMIN-FACING FUNCTIONAL SCOPE (staff/admin only, via Supabase Auth with role check — profiles table distinguishes staff/admin, customers never get an account or role):
- Menu management: add, edit, and delete categories (name, display order). Add, edit, and delete menu items (name, description, price, category, image, availability toggle). Images are uploaded directly from the admin panel to Cloudinary — no manual file-hosting steps for the restaurant owner. Toggling an item's availability off immediately hides it from the public menu without deleting its data or order history.
- Order dashboard: a live-updating order list (newest first) using Supabase Realtime — new orders appear automatically without a page refresh, with a visual alert and an audio alert (audio requires one prior user interaction on the page, per standard browser autoplay policy — this is expected browser behavior, not a bug). The list supports searching by customer name or phone number, and is paginated (do not load the entire order history at once — this will slow down as order volume grows).
- Staff can update order status: Pending -> Preparing -> Ready -> Completed (or Cancelled).
- Staff can view and print/download a receipt for any individual order (same receipt layout the customer sees).
- Reports section: total orders today, and revenue for today, this week, this month, and this year — calculated from total_amount, excluding cancelled orders.

NON-FUNCTIONAL REQUIREMENTS:
- Mobile-first, fully responsive across mobile, tablet, desktop.
- SEO: Next.js Metadata API on every page, Restaurant JSON-LD structured data on the homepage, sitemap.xml, Open Graph tags for social link previews, a favicon, and descriptive alt text on all images.
- Robustness: a custom 404 (not-found) page and a custom error boundary page, both styled consistently with the rest of the site rather than showing a default blank/generic error screen.
- Performance: Cloudinary responsive image delivery, minimal Framer Motion usage, no layout shift.
- Security: Supabase RLS on all tables — public read-only on menu_items/categories, insert-only public access on orders, staff-only full access on orders/profiles/category and menu-item writes. Basic rate-limiting on order creation to prevent spam.
- Accessibility: keyboard-navigable, sufficient color contrast, proper form labels.
- The system must be simple, stable, and bug-free for a first-time client launch, built in small, independently testable increments. Do not introduce features beyond what is listed above (no WhatsApp integration, no online payment gateway, no customer accounts, no loyalty program, no multi-language support) in this version.

Write spec.md as a "what the system must do" document — no code, no implementation detail. Self-contained, requiring no outside context.

## Response snapshot

Created full feature specification (`spec.md`) at `specs/001-restaurant-ordering/spec.md` with 4 user stories (Browse + Place Order — P1, Admin Menu Management — P1, Live Order Dashboard — P2, Admin Reports — P3), 26 functional requirements, 7 non-functional requirements, 4 key entities (Category, Menu Item, Order, Profile), 8 measurable success criteria, and comprehensive edge cases. Created quality checklist at `specs/001-restaurant-ordering/checklists/requirements.md` — all items pass validation. Branch `001-restaurant-ordering` created and checked out.

## Outcome

- ✅ Impact: Complete feature specification written — all placeholders replaced, no [NEEDS CLARIFICATION] markers, all validation items pass
- 🧪 Tests: null
- 📁 Files: 2 (spec.md + checklists/requirements.md)
- 🔁 Next prompts: Technical planning via /sp.plan
- 🧠 Reflection: User input was comprehensive — no clarifications needed. The spec stays purely at the "what" level with no implementation details.

## Evaluation notes (flywheel)

- Failure modes observed: The create-new-feature.ps1 script had parameter binding issues with `$FeatureDescription` containing `&` and being bound to `$Number` (int). Worked around by explicitly passing `-Number 1` before the description.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): none
