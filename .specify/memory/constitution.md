<!--
  Sync Impact Report

  Version change: none → 1.0.0 (initial constitution)
  Modified principles: N/A (new constitution)
  Added sections:
    - 6 Core Principles (Simplicity First, Small Verified Increments,
      Next.js 16 App Router Discipline, No Leftover Debt,
      Single Source of Truth, Defensive Error Handling)
    - Technical Constraints
    - Definition of Done
    - Governance
  Removed sections: none
  Templates requiring updates:
    ✅ .specify/templates/plan-template.md — Constitution Check section
       references "constitution file" generically; no specific principle
       names need updating since this is a first-time constitution.
    ✅ .specify/templates/spec-template.md — No constitution-specific
       sections referenced; no update needed.
    ✅ .specify/templates/tasks-template.md — Task categorization
       (testing discipline) aligns with Defensive Error Handling and
       No Leftover Debt principles; no update needed.
    ⚠ .opencode/command/sp.constitution.md — Step 4 references
       `.specify/templates/commands/*.md` but commands live under
       `.opencode/command/`. This is a pre-existing template path issue,
       not a constitution change. Flagged for manual review.
  Follow-up TODOs: none
-->

# Rindaan Cafe & Cuisine Constitution

## Core Principles

### I. Simplicity First
Always choose the simpler approach. This project has no external
monitoring, analytics, or error-tracking services — code MUST be
defensively written and manually verified at each step. When in doubt
between complexity and simplicity, always choose simplicity. New
dependencies or tools MUST be justified against this principle before
adoption.

### II. Small Verified Increments
Implement one milestone fully before proceeding to the next. Write
correct, working code on the first pass per milestone — no large
speculative builds. Each milestone MUST be verified against the
Definition of Done (see Section 3) before the next begins. Verification
includes testing on a real mobile viewport, confirming zero console
errors, and manually testing RLS policies (both allowed and blocked
cases).

### III. Next.js 16 App Router Discipline
- Server components are the default; `"use client"` MUST only be added
  where interactivity (event handlers, hooks, browser APIs) is required.
- Mutations MUST use Server Actions instead of manual API route handlers
  where possible.
- Dynamic route handlers and page components MUST use the async
  `params`/`searchParams` API — always `await params` before accessing
  route parameters. The older synchronous pattern is forbidden.
- SEO is not retrofitted: every page MUST export proper `metadata`
  (title, description) as it is built. Images MUST have meaningful `alt`
  text from the moment they are added. Semantic HTML (heading hierarchy,
  `<nav>`, `<main>`, `<footer>` landmarks) MUST be present from the
  start.

### IV. No Leftover Debt
Every milestone marked done MUST be fully functional. No placeholder
code, TODO comments, or speculative stubs from later milestones may
remain. Each milestone must be self-contained and demonstrable before
work on the next begins.

### V. Single Source of Truth for Validation
Zod schemas MUST be shared between React Hook Form (client-side
validation) and server-side insert/update validation. The same schema
is reused, never duplicated. This applies to all form-driven features
throughout the application.

### VI. Defensive Error Handling
Every Server Action and data-fetching operation MUST handle failure
gracefully. Users MUST see a clear, context-aware message on error —
no blank screens, no unhandled promise rejections, no silent failures.
Edge cases (empty cart, duplicate submission, invalid form fields,
orphaned records) MUST be explicitly handled at the point they could
occur.

## Technical Constraints

### Environment Variables (exact names)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (browser-safe)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Supabase publishable key
  (browser-safe; replaces the older ANON_KEY naming)
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase secret key (server-only, never
  exposed to client)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name
  (browser-safe)
- `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` — Cloudinary
  credentials (server-only, never exposed to client)
All Supabase client instances (browser and server) MUST reference these
exact names. Do not use the older `ANON_KEY` convention in any code.

### Supabase RLS Policy Structure
Every table MUST have RLS policies defined in the same step the table is
created. Never leave a table with RLS enabled but no policies — that
blocks all access.
- `menu_items`, `categories`: public read-only
- `orders`: insert-only for public, full access for staff
- `orders`, `profiles`: staff-only full access
- `categories`, `menu_items`: staff-only write access

### Cloudinary Signed-Upload Flow
Admin-side image uploads MUST use Cloudinary's signed-upload flow. The
upload signature is generated server-side (API secret never reaches the
client). The client uploads directly to Cloudinary, and the returned URL
is saved to `menu_items.image_url`.

### Supabase Realtime Subscriptions
Admin dashboard Realtime subscriptions MUST include proper channel
setup and cleanup on component unmount to prevent duplicate
subscriptions. An audio-unlock-on-first-interaction pattern (e.g. a
one-time "enable notifications" prompt) MUST be used to comply with
browser autoplay policy.

### Order List Pagination & Search
MUST use server-side query patterns. Never load the full dataset and
filter client-side.

### Receipt Rendering
A single reusable receipt component MUST be used for both the customer
confirmation screen and the admin order view. Use the browser's native
`window.print()` — no PDF-generation library.

### Custom Error Pages
The project MUST have custom `not-found.tsx` and `error.tsx` at the app
root, styled consistently with the site theme. Never leave the framework
defaults.

### Git Conventions
- One feature branch per milestone
- Descriptive commit messages referencing the milestone number
- No direct commits to `main`

### Infrastructure Limits
This version uses only Supabase (DB/Auth/Storage/Realtime), Cloudinary
(images), and Vercel (hosting). No payment gateway, error-tracking,
analytics, SMS, email, or WhatsApp integration services are permitted.

## Definition of Done

Before a milestone is marked complete, ALL of the following MUST pass:

- Works correctly on a real mobile viewport (not just a resized desktop
  browser)
- Zero console errors or warnings during normal use
- All relevant RLS policies manually tested — confirm restricted actions
  are blocked, not just that allowed actions work
- Edge cases handled:
  - Empty cart at checkout blocked with a clear message
  - Invalid/missing form fields rejected with visible errors
  - Duplicate rapid form submission does not create duplicate orders
  - Realtime subscriptions do not leak or duplicate on repeated
    dashboard visits
  - Deleting a category with existing menu items does not silently
    orphan them
- No feature from a later milestone is silently half-built to get ahead

## Governance

The constitution supersedes all other practices and conventions.
Amendments to the constitution require:

1. A documented proposal describing the change and its rationale
2. Approval (via issue/PR discussion or verbal consent from the
   architect)
3. A version bump following semantic versioning:
   - MAJOR: Backward-incompatible governance or principle
     removals/redefinitions
   - MINOR: New principle/section added or materially expanded guidance
   - PATCH: Clarifications, wording, typo fixes, non-semantic
     refinements
4. Update of the `LAST_AMENDED_DATE` field
5. Review of dependent templates for alignment (spec, plan, tasks)

All PRs and code reviews MUST verify compliance with the constitution.
Complexity introduced in any change MUST be justified if it conflicts
with Principle I (Simplicity First).

**Version**: 1.0.0 | **Ratified**: 2026-07-11 | **Last Amended**: 2026-07-11
