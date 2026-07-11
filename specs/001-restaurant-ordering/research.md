# Research: Restaurant Ordering Website

**Phase**: 0 — Outline & Research
**Date**: 2026-07-11

## Research Tasks

| # | Question / Unknown | Resolution | Source / Rationale |
|---|---|---|---|
| 1 | Supabase Realtime channel setup for new-order alerts | Use channel `.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, callback)`. Subscribe in a `useEffect` with cleanup (`.unsubscribe()`). Audio alert: create `Audio` element on first user interaction, call `.play()` on new-order event. | Supabase JS SDK v2 docs; browser autoplay policy. |
| 2 | Cloudinary signed-upload flow for admin | Admin panel calls a server action that generates an upload signature using `cloudinary.utils.api_sign_request()` with `CLOUDINARY_API_SECRET`. Client uploads directly to Cloudinary's unsigned endpoint with the signature, receives `secure_url`, stores that URL in `menu_items.image_url`. | Cloudinary signed-upload API docs; constitution Principle VI (Defensive — secret never reaches client). |
| 3 | Next.js 16 async params API | All page/layout components with dynamic params MUST define `params` as a Promise and `await params` before accessing. Example: `export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; ... }`. | User input + `AGENTS.md` — "Read the relevant guide in node_modules/next/dist/docs/". |
| 4 | Supabase RLS policies for order_items | `order_items` follows the same access pattern as `orders`: public insert-only (within the same transaction as order creation), staff full read. | Derived from spec RLS requirements — order_items is a child of orders. |
| 5 | Rate-limiting approach for order creation | Since no external services (Upstash, etc.), use Supabase's built-in `created_at` check in the server action: reject if the same `customer_phone` has an order within the last 60 seconds. Simple, no additional infra. | Constitution Principle I (Simplicity First) — no external rate-limiting service. |
| 6 | Audio-unlock-on-first-interaction pattern | On the admin dashboard page, attach a one-time event listener (`click`, `keydown`) to the document. On first interaction, create and "play" a silent `Audio` buffer (or unmute a pre-created element), marking the audio context as user-activated. Subsequent new-order events can then play an alert sound. | Standard browser autoplay policy; common pattern in notification-heavy SPAs. |
| 7 | Generic error page without error-tracking | `error.tsx` uses the `error` prop to display "Something went wrong" + a retry button. No error-reporting service call. `not-found.tsx` shows a custom 404 message. Both styled with the site's theme tokens. | Spec NFR-003; constitution Principle VI. |

## Architectural Decisions

### Database schema approach
- **Decision**: Use Zod schemas as the single source of truth for
  validation, deriving TypeScript types from them with `z.infer<>`.
  Never hand-write separate TypeScript interfaces for entities.
- **Rationale**: Constitution Principle V mandates shared schemas.

### Image upload pattern
- **Decision**: Admin panel UI invokes a server action to get a
  Cloudinary signature, then uploads the file directly to Cloudinary
  from the browser. The returned URL is passed to the server action
  that creates/updates the menu item.
- **Rationale**: Keeps API secret server-only (Principle VI). No
  file hits the Next.js server — simpler, cheaper, faster.

### Order deduplication
- **Decision**: Disable the submit button immediately on first click
  (client-side guard) AND in the server action, check if an identical
  order (same `customer_name`, `customer_phone`, same `order_items`
  content) was created within the last 10 seconds.
- **Rationale**: Defense in depth — client guard prevents most double-
  taps; server check catches API replay or race conditions.
