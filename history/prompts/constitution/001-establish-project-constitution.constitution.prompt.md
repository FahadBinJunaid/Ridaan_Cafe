---
id: 001
title: establish-project-constitution
stage: constitution
date: 2026-07-11
surface: agent
model: deepseek-v4-flash-free
feature: none
branch: master
user: FahadBinJunaid
command: "Establish the project constitution for 'Rindaan Cafe & Cuisine'..."
labels: ["constitution", "project-setup", "principles", "governance", "sdd"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - null
---

## Prompt

Establish the project constitution for "Rindaan Cafe & Cuisine" — a Pakistani Dhaba-style restaurant ordering website. This is a first-time client project with no external monitoring tools, so code must be defensively written, built in small verifiable increments, and manually checked at each step. When in doubt between complexity and simplicity, always choose simplicity.

CODE QUALITY BASELINE (applies to every milestone):
- Write correct, working code on the first pass for each small milestone rather than large speculative builds — implement one milestone fully, verify it, then move to the next.
- Follow Next.js 16 App Router conventions correctly: server components by default, "use client" only where interactivity is required, server actions for mutations instead of manual API route handlers where possible.
- Next.js 16's async params/searchParams API must be used in all dynamic route handlers and page components — always await params before accessing route parameters. Do not use the older synchronous params pattern.
- Follow SEO best practice throughout, not just in a final milestone: every page must export proper metadata (title, description) as it is built, not retrofitted at the end; images must have meaningful alt text from the moment they're added; semantic HTML (proper heading hierarchy, nav/main/footer landmarks) from the start.
- No placeholder/TODO code left in a milestone marked done — every milestone must be fully functional before the next begins.

ENVIRONMENT VARIABLE NAMING (exact, do not substitute other names):
- NEXT_PUBLIC_SUPABASE_URL — Supabase project URL, browser-safe.
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — Supabase's newer publishable key format (replaces the older "anon key" naming), browser-safe.
- SUPABASE_SERVICE_ROLE_KEY — Supabase's secret/service-role key, server-only, never exposed to the client.
- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME — browser-safe.
- CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET — server-only, never exposed to the client.
All Supabase client instances (browser and server) must reference exactly these variable names — do not assume or generate code around the older ANON_KEY naming convention.

CONVENTIONS:
- File/folder naming in the Next.js App Router structure: storefront routes and an isolated /admin route group kept fully separate, shared components in a common location, server actions clearly organized.
- Shared Zod schema usage between React Hook Form client validation and server-side insert validation — one schema, reused, never duplicated.
- Supabase RLS policy structure per table: public read-only on menu_items/categories, insert-only public access on orders, staff-only full access on orders/profiles and staff-only write access on categories/menu_items. Whenever a new table is created, its RLS policies must be written in the same step — never leave a table with RLS enabled but no policies defined, since that blocks all access including legitimate reads/writes.
- Cloudinary signed-upload flow for admin-side image uploads: the upload signature is generated server-side (the Cloudinary API secret must never be exposed to the client), the client uploads directly to Cloudinary, and the resulting URL is saved to menu_items.image_url.
- Supabase Realtime subscription setup on the admin dashboard: proper channel setup, cleanup on component unmount to avoid duplicate subscriptions, and an audio-unlock-on-first-interaction pattern (e.g. a one-time "enable notifications" prompt, or unlocking a muted Audio element on first click/keypress) to comply with browser autoplay policy.
- Order list pagination and search: always server-side query pattern, never client-side filtering of a fully-loaded dataset.
- Receipt rendering: one reusable component used both on the customer confirmation screen and in the admin order view, using the browser's native print functionality rather than a PDF-generation library.
- Custom not-found.tsx and error.tsx at the app root, styled consistently with the site theme, never left as framework defaults.
- Git conventions: one feature branch per milestone, descriptive commit messages referencing the milestone number, no direct commits to main.
- Error handling baseline: every server action and data-fetch must handle failure gracefully with a clear user-facing message — no blank screens, no unhandled promise rejections.

DEFINITION OF DONE (applies to every milestone before moving to the next):
- Works correctly on a real mobile viewport, not just a resized desktop browser.
- Zero console errors or warnings during normal use.
- All relevant RLS policies manually tested — confirm restricted actions are actually blocked, not just that allowed actions work.
- Edge cases handled: empty cart at checkout blocked with a clear message, invalid/missing form fields rejected with visible errors, duplicate rapid form submission does not create duplicate orders, Realtime subscriptions do not leak or duplicate on repeated dashboard visits, deleting a category with existing menu items does not silently orphan them.
- No feature from a later milestone is silently half-built to get ahead.

Infrastructure is strictly limited to Supabase, Cloudinary, and Vercel — no error-tracking, analytics, SMS, email, or payment-gateway service in this version. Do not introduce tools or dependencies beyond what is explicitly listed here.

## Response snapshot

Created the project constitution (v1.0.0) at `.specify/memory/constitution.md` with 6 Core Principles (Simplicity First, Small Verified Increments, Next.js 16 App Router Discipline, No Leftover Debt, Single Source of Truth for Validation, Defensive Error Handling), a Technical Constraints section covering env var naming, RLS policies, Cloudinary upload flow, Realtime subscriptions, pagination, receipt rendering, custom error pages, git conventions, and infrastructure limits; a Definition of Done section; and a Governance section with amendment procedure and semantic versioning policy. Templates were validated for consistency; a pre-existing path issue in sp.constitution.md (references `.specify/templates/commands/` instead of `.opencode/command/`) was flagged for manual review.

## Outcome

- ✅ Impact: First project constitution established — all placeholders replaced, Sync Impact Report included
- 🧪 Tests: null
- 📁 Files: 1 (`.specify/memory/constitution.md`)
- 🔁 Next prompts: Feature specifications and planning via /sp.specify and /sp.plan
- 🧠 Reflection: The template had a double-underscore placeholder `[PRINCIPLE__DESCRIPTION]` that was corrected to a single-underscore format when replaced

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): none
