---
id: 009
title: implement-milestones-7-8
stage: green
date: 2026-07-12
surface: agent
model: deepseek-v4-flash-free
feature: 001-restaurant-ordering
branch: 001-restaurant-ordering
user: FahadBinJunaid
command: Milestone 7 (T028-T030) implement karo — Zustand cart, cart page, wired buttons. Milestone 8 (T031-T036) — COD Checkout with Zod schema, server action, checkout form, receipt, confirmation page.
labels: ["implementation", "cart", "zustand", "checkout", "receipt", "milestone-7", "milestone-8"]
links:
  spec: specs/001-restaurant-ordering/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - src/lib/store/cart.ts (new — Zustand store with persist + selectors)
  - src/components/shared/add-to-cart-button.tsx (new — client Add to Cart)
  - src/components/shared/site-header.tsx (new — shared header with cart badge)
  - src/app/cart/page.tsx (new — cart page server shell)
  - src/app/cart/cart-content.tsx (new + updated — cart + checkout form)
  - src/components/shared/menu-item-card.tsx (updated — Add to Cart button on card)
  - src/app/menu/[slug]/page.tsx (updated — uses AddToCartButton component)
  - src/app/layout.tsx (updated — added SiteHeader)
  - src/app/page.tsx (updated — removed inline header, uses layout header)
  - src/lib/schemas/checkout.ts (new — Zod schema shared client+server)
  - src/actions/create-order.ts (new — server action + rate limit)
  - src/components/shared/receipt.tsx (new — printable receipt)
  - src/app/order/confirmation/[reference]/page.tsx (new — confirmation page)
tests:
  - null
---

## Prompt

Milestone 7 (T028-T030) implement karo — Zustand cart, cart page, wired buttons + Milestone 8 (T031-T036) — COD Checkout with Zod schema, server action, checkout form, receipt, confirmation page.

## Response snapshot

### Milestone 7 — Cart with Zustand (T028-T030)

**T028 — `src/lib/store/cart.ts`**
- Zustand store with `persist` middleware (localStorage key: `ridaan-cafe-cart`)
- Actions: `addItem` (increments qty if exists), `removeItem`, `updateQuantity` (auto-removes at 0), `clearCart`
- Selectors: `selectCartCount`, `selectSubtotal` (derived via `reduce`)

**T029 — `src/app/cart/page.tsx` + `cart-content.tsx`**
- Server shell page with metadata; client component `CartContent` handles all state
- Empty state: "Your cart is empty" + "Browse Menu" link
- Item rows: name, unit price, `-`/qty/`+` controls, line total, `×` remove button
- "Clear All" action, subtotal at bottom

**T030 — Wiring + badge**
- `menu-item-card.tsx`: added `"use client"`, "Add to Cart" button with `e.preventDefault() + e.stopPropagation()` to prevent link navigation
- `menu/[slug]/page.tsx`: uses `AddToCartButton` client component
- `site-header.tsx`: new client component with logo, "Full Menu" link, "Cart" link with badge showing `selectCartCount`; badge hidden when count=0
- `layout.tsx`: includes `SiteHeader` replacing the inline header from page.tsx
- `page.tsx` (homepage): removed inline header/footer, keeps only main content + footer

### Milestone 8 — COD Checkout (T031-T036)

**T031 — `src/lib/schemas/checkout.ts`**
- `checkoutItemSchema`: id, name, price (positive), quantity (positive int)
- `checkoutSchema`: customer_name (1-100 chars), customer_phone (10-20 chars), delivery_address (1-500 chars), notes (optional, max 500), items (array min 1)
- Exported `CheckoutFormData` type

**T032 — `src/actions/create-order.ts`**
- Server action: parses FormData → validates with `checkoutSchema`
- Generates `RDC-XXXXXXXX` reference (retry loop for uniqueness)
- Computes `total_amount` from items
- Rate-limit: in-memory Map per phone → 60s window; returns error if too fast
- Inserts order row → inserts order_items rows → returns `{ reference_number }`
- On order_items insert failure: rolls back by deleting the order
- Catches all errors → returns `{ success: false, error }`

**T033 — `src/lib/supabase/server.ts`**
- Already existed from M4; uses `SUPABASE_SERVICE_ROLE_KEY` to create admin client

**T034 — Checkout form in cart page**
- `cart-content.tsx` extended with React Hook Form + `zodResolver`
- Fields: Name, Phone, Delivery Address, Order Notes (optional)
- Client-side validation with error messages
- On submit: builds FormData → calls `createOrder` server action
- On success: `clearCart()` → redirect to `/order/confirmation/<reference>`
- On error: displays server error message
- Submit button disabled after first click (`isSubmitting` state)

**T035 — `src/components/shared/receipt.tsx`**
- Client component with `window.print()` button
- Shows: restaurant name, order reference, date/time, status, customer info, item table (name/qty/price/line-total), total, COD notice
- Wrapped in `#receipt-content` div for print targeting

**T036 — `src/app/order/confirmation/[reference]/page.tsx`**
- `params: Promise<{ reference: string }>` with `await params`
- Fetches order by `reference_number` from Supabase (service role)
- Fetches order_items by `order_id`
- Renders `<Receipt>` component with order data
- `notFound()` if order doesn't exist
- Dynamic metadata via `generateMetadata`

## Outcome

- ✅ Impact: Milestones 7+8 complete — cart persistence, add-to-cart wiring, COD checkout flow, printable receipt, confirmation page
- 🧪 Tests: Build + tsc verified (zero errors), route table shows `ƒ /order/confirmation/[reference]`
- 📁 Files: 9 new, 4 modified
- 🔁 Next prompts: Milestone 9 (Admin Auth + Login)
- 🧠 Reflection: The server action approach (`"use server"` in actions directory) works well for Next.js 16. Rate limiting is in-memory (per-VM) — for multi-instance Vercel deploys, a DB-based approach would be needed. The receipt is a client component to enable `window.print()`.

## Evaluation notes (flywheel)

- Failure modes observed: TypeScript errors in create-order.ts (FormData parsing with `Record<string, unknown>` typed `raw.items` — fixed by using separate typed array); ZodError.issues not .errors (v5 API change)
- Graders run and results (PASS/FAIL): PASS — tsc zero errors, next build compiled successfully
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): User to verify via browser
