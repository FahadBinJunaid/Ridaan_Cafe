# Implementation Plan: Restaurant Ordering Website — Rindaan Cafe & Cuisine

**Branch**: `001-restaurant-ordering` | **Date**: 2026-07-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-restaurant-ordering/spec.md`

## Summary

A full-stack restaurant ordering website for Rindaan Cafe & Cuisine
(Pakistani Dhaba-style, Karachi). Guests browse a dynamic menu, search
by text/category, add items to a client-side cart, and place Cash-on-
Delivery orders (no accounts). An admin panel (Staff/Auth-protected)
provides menu management with Cloudinary image uploads, a live-updating
order dashboard (Supabase Realtime) with server-side pagination/search,
order status workflow, and revenue reports. Next.js 16 App Router,
Supabase (DB/Auth/Storage/Realtime), Cloudinary, and Vercel.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20.x (Vercel runtime)  
**Primary Dependencies**: Next.js 16 (App Router), Supabase js v2,
  Cloudinary SDK (server-side signing), shadcn/ui, Tailwind CSS v4,
  Framer Motion (hero/card micro-animations only), Zustand (cart only),
  React Hook Form + Zod (all form validation)  
**Storage**: Supabase PostgreSQL (managed), Cloudinary (images)  
**Testing**: Manual — constitution mandates no external monitoring/analytics
  tools; each milestone verified manually against Definition of Done  
**Target Platform**: Modern browsers (mobile Chrome/Safari, desktop),
  Vercel serverless + edge functions  
**Project Type**: Web application — Next.js App Router (src/ directory)  
**Performance Goals**: Lighthouse Performance 85+, Accessibility 90+,
  zero console errors, no layout shift  
**Constraints**: Mobile-first responsive; infra limited to Supabase,
  Cloudinary, Vercel; no payment gateway, analytics, SMS, email, or
  error-tracking; RLS-enabled on every table with policies defined at
  creation time  
**Scale/Scope**: Single restaurant, anonymous guest visitors,
  1–5 staff/admin users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Compliance | Notes |
|-----------|------------|-------|
| I. Simplicity First | ✅ PASS | No unnecessary services; infra strictly limited to Supabase, Cloudinary, Vercel |
| II. Small Verified Increments | ✅ PASS | Spec organized as 4 independently testable user stories (P1→P2→P3) |
| III. Next.js 16 App Router | ✅ PASS | Server-first, async params, server actions, SEO-from-day-one |
| IV. No Leftover Debt | ✅ PASS | Scope explicitly bounded — no half-built future features |
| V. Shared Validation | ✅ PASS | Zod schemas reused between client (React Hook Form) and server |
| VI. Defensive Error Handling | ✅ PASS | Custom error/not-found pages, graceful failure on all data flows |

No violations found. Complexity Tracking section not required.

## Project Structure

### Documentation (this feature)

```text
specs/001-restaurant-ordering/
├── spec.md               # Feature specification (/sp.specify output)
├── plan.md               # This file (/sp.plan output)
├── research.md           # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
├── contracts/            # Phase 1 output
│   └── server-actions.md
├── checklists/
│   └── requirements.md   # Spec quality checklist
└── tasks.md              # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx               # Root layout (fonts, metadata base)
│   ├── globals.css              # Tailwind base + theme tokens
│   ├── not-found.tsx            # Custom 404 (site-themed)
│   ├── error.tsx                # Custom error boundary (site-themed)
│   ├── page.tsx                 # Homepage (hero, categories, contact)
│   ├── menu/
│   │   ├── page.tsx             # Full menu page (all categories)
│   │   └── [slug]/
│   │       └── page.tsx         # Single food detail page (async params)
│   ├── cart/
│   │   └── page.tsx             # Cart review + checkout form
│   ├── order/
│   │   └── confirmation/
│   │       └── [reference]/
│   │           └── page.tsx     # Order confirmation + receipt
│   ├── sitemap.ts               # Generated sitemap.xml
│   ├── robots.ts                # robots.txt
│   ├── (admin)/                 # Route group — no layout effect
│   │   └── admin/
│   │       ├── login/
│   │       │   └── page.tsx     # Staff login page
│   │       ├── layout.tsx       # Admin layout (sidebar, auth check)
│   │       ├── page.tsx         # Admin dashboard (order list)
│   │       ├── menu/
│   │       │   └── page.tsx     # Category + menu item CRUD
│   │       ├── orders/
│   │       │   └── [id]/
│   │       │       └── page.tsx  # Single order detail + receipt
│   │       └── reports/
│   │           └── page.tsx     # Revenue + order count aggregates
├── components/
│   ├── ui/                      # shadcn/ui components
│   └── shared/
│       ├── receipt.tsx           # Reusable receipt (customer + admin)
│       ├── hero-section.tsx
│       ├── category-tiles.tsx
│       ├── menu-item-card.tsx
│       └── ...
├── lib/
│   ├── utils.ts                 # cn() helper
│   ├── supabase/
│   │   ├── client.ts            # Browser Supabase client (publishable key)
│   │   └── server.ts            # Server Supabase client (service role)
│   ├── schemas/
│   │   ├── checkout.ts          # Zod schema (checkout form + server insert)
│   │   ├── category.ts          # Zod schema (category create/update)
│   │   └── menu-item.ts         # Zod schema (menu item create/update)
│   ├── store/
│   │   └── cart.ts              # Zustand cart store
│   └── cloudinary.ts            # Cloudinary signature helper
├── actions/
│   ├── create-order.ts          # Server action: order + order_items insert
│   ├── update-order-status.ts   # Server action: status transition
│   ├── manage-category.ts       # Server action: category CRUD
│   └── manage-menu-item.ts      # Server action: menu item CRUD
└── middleware.ts                # Admin route protection (session + role check)
```

**Structure Decision**: Option 2 — Web application with Next.js App
Router (src/ directory). All storefront routes under `src/app/`, admin
routes under `src/app/(admin)/admin/`. Shared UI components in
`src/components/shared/`, shadcn primitives in `src/components/ui/`.
Server actions co-located in `src/actions/`. Zod schemas in
`src/lib/schemas/`. Supabase clients in `src/lib/supabase/`.
