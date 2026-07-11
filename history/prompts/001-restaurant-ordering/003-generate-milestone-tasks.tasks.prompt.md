---
id: 003
title: generate-milestone-tasks
stage: tasks
date: 2026-07-11
surface: agent
model: deepseek-v4-flash-free
feature: 001-restaurant-ordering
branch: 001-restaurant-ordering
user: FahadBinJunaid
command: /sp.tasks
labels: ["tasks", "milestones", "restaurant-ordering", "checklist"]
links:
  spec: specs/001-restaurant-ordering/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-restaurant-ordering/tasks.md
tests:
  - null
---

## Prompt

Generate a complete tasks.md for "Rindaan Cafe & Cuisine" breaking plan.md into exactly 13 sequential, independently testable milestones, each with explicit "done" acceptance criteria. Build in small increments — do not merge or reorder milestones.

1. Project scaffold — Next.js 16 + TypeScript + Tailwind + shadcn/ui, design tokens for the warm/wooden theme, favicon added. Done = runs locally and on Vercel preview with a styled placeholder homepage.

2. Static homepage — hero section, category tiles (hardcoded mock categories for now), Contact/Location section with placeholder address/phone/hours clearly marked as placeholders. Done = homepage displays correctly and responsively on mobile and desktop with mock data.

3. Static full menu UI — category-by-category listing and a "Full Menu" scroll view, using hardcoded mock JSON data. Done = menu displays correctly and responsively using fake data.

4. Supabase schema + live data — create all tables (categories, menu_items, orders, order_items, profiles) with RLS policies defined in the same step as each table (RLS is auto-enabled on creation, so policies cannot be deferred); connect the homepage category tiles and menu UI (from milestones 2-3) to real Supabase data using NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Done = homepage and menu render real data, RLS confirmed (public can read menu_items/categories, cannot write).

5. Search and category filtering on the live menu data. Done = filtering/search work and update the UI without a full reload.

6. Food detail view (dynamic route using Next.js 16 async params). Done = detail view shows correct data per item, add-to-cart works from it.

7. Cart with Zustand — add/remove/update quantity/subtotal. Done = cart state correctly persists across navigation during the session.

8. Cash-on-Delivery checkout — form validated with Zod, creates order + order_items rows, on-screen confirmation with downloadable/printable receipt. Done = a real order appears correctly in the database, invalid submissions are blocked, receipt shows correct details and can be printed/saved.

9. Staff authentication — Supabase Auth login, profiles role check, middleware protecting all /admin routes. Done = unauthenticated users cannot reach any /admin route.

10. Admin menu management — category CRUD (create/edit/reorder/delete with orphan protection) and menu-item CRUD (create/edit/delete/toggle availability) including direct Cloudinary image upload from the admin form (using CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET server-side for signed uploads). Done = staff can add a new dish with a real uploaded image and it correctly appears (or disappears, if unavailable) on the public menu without a deployment.

11. Admin order dashboard — order list with status updates (Pending -> Preparing -> Ready -> Completed/Cancelled), search by customer name/phone, pagination, per-order receipt printing, and a Supabase Realtime subscription that live-updates the list with a visual and audio alert on new orders (audio unlocked after first page interaction). Done = staff can manage orders, search finds the correct order, pagination works past 20 orders, and a newly placed order appears with an alert without a manual refresh.

12. Admin reports — today/week/month/year order counts and revenue (cancelled orders excluded). Done = Reports numbers match a manual count/sum of actual orders in the database for each period.

13. SEO, error pages, and deployment — Metadata API, Restaurant JSON-LD, sitemap.xml, Open Graph tags, alt text audit, custom styled not-found and error pages, final production deployment to Vercel (dynamic routes verified working with async params on production build). Done = site is live, structured data validates in Google's Rich Results test, and visiting a broken/nonexistent URL shows the custom 404 page instead of a framework default.

Write tasks.md as a milestone checklist document — no code. Self-contained.

## Response snapshot

Created tasks.md at `specs/001-restaurant-ordering/tasks.md` with exactly 13 milestones, containing 62 tasks in strict checklist format (`- [ ] TNNN [P] [MN] Description with path`). Each milestone has clear "Done" criteria. Milestones are sequential: M1 Scaffold → M2 Static Homepage → M3 Static Menu → M4 Supabase + Live Data → M5 Search/Filter → M6 Food Detail → M7 Cart → M8 Checkout → M9 Auth → M10 Menu Management → M11 Order Dashboard → M12 Reports → M13 SEO/Deploy. Dependencies section shows execution order; parallel opportunities marked per milestone.

## Outcome

- ✅ Impact: Complete task breakdown — 62 tasks across 13 milestones, all in strict format with file paths
- 🧪 Tests: null
- 📁 Files: 1 (specs/001-restaurant-ordering/tasks.md)
- 🔁 Next prompts: Implementation — start with M1 (project scaffold)
- 🧠 Reflection: Milestones build naturally from static UI → live data → public features → admin features → polish, matching the spec's P1→P2→P3 priority pattern.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): none
