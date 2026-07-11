# Data Model: Restaurant Ordering Website

**Phase**: 1 — Design & Contracts
**Date**: 2026-07-11

## Entity-Relationship Overview

```
categories  1──N  menu_items
                        |
                        |
                   orders 1──N  order_items  N──1  menu_items
                        |
                   profiles (FK to auth.users)
```

All tables live in the `public` schema of Supabase PostgreSQL.

---

## Category

Represents a food category (e.g. Starters, Barbeque, Dessert).

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | `uuid` | PK, default `gen_random_uuid()` | |
| name | `text` | NOT NULL | Display name |
| display_order | `integer` | NOT NULL, default 0 | Sort order on public menu |
| created_at | `timestamptz` | NOT NULL, default `now()` | |

**RLS**: Public read-only; staff full access.
**Validation (Zod)**: `name` min 1 char, max 100 chars; `display_order`
non-negative integer.
**Deletion constraint**: If `menu_items` reference this category,
deletion is blocked (FK constraint) unless items are reassigned first.

---

## Menu Item

A single dish.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | `uuid` | PK, default `gen_random_uuid()` | |
| category_id | `uuid` | FK → categories.id, NOT NULL | |
| name | `text` | NOT NULL | |
| description | `text` | NOT NULL, default '' | |
| price | `numeric(10,2)` | NOT NULL, CHECK (> 0) | |
| image_url | `text` | nullable | Cloudinary secure_url |
| is_available | `boolean` | NOT NULL, default true | Toggle for public visibility |
| created_at | `timestamptz` | NOT NULL, default `now()` | |
| updated_at | `timestamptz` | NOT NULL, default `now()` | Updated on edit |

**RLS**: Public read-only (WHERE `is_available = true` for public
queries); staff full access.
**Validation (Zod)**: `name` min 1, max 200 chars; `description` max
2000 chars; `price` must be positive decimal with max 2 fractional
digits; `image_url` must be valid HTTPS URL (nullable); `category_id`
valid UUID.

---

## Order

A customer's takeaway/delivery order.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | `uuid` | PK, default `gen_random_uuid()` | |
| reference_number | `text` | UNIQUE, NOT NULL | Human-readable, e.g. `RDC-XXXXXXXX` |
| customer_name | `text` | NOT NULL | |
| customer_phone | `text` | NOT NULL | |
| delivery_address | `text` | NOT NULL | |
| notes | `text` | nullable | Optional order notes |
| payment_status | `text` | NOT NULL, CHECK IN ('cod_pending', 'cancelled') | Default 'cod_pending' |
| order_status | `text` | NOT NULL, CHECK IN ('pending', 'preparing', 'ready', 'completed', 'cancelled') | Default 'pending' |
| total_amount | `numeric(10,2)` | NOT NULL | Sum of order_items at submission |
| created_at | `timestamptz` | NOT NULL, default `now()` | |

**RLS**: Public insert-only (anonymous guests can create); staff full
read + update (status transitions). Staff can update `order_status` and
`payment_status` only — cannot modify customer data or total.
**Validation (Zod)**: `customer_name` min 1, max 100; `customer_phone`
min 10, max 20 (digits, +, -, spaces); `delivery_address` min 1,
max 500; `notes` max 500 (nullable).

### Status State Machine

```
pending ──→ preparing ──→ ready ──→ completed
    │            │           │
    └─── cancelled ──────────┘
```
Staff can cancel at any `pending`, `preparing`, or `ready` state.
`completed` and `cancelled` are terminal states.

---

## Order Item

A snapshot of a menu item at the time of order.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | `uuid` | PK, default `gen_random_uuid()` | |
| order_id | `uuid` | FK → orders.id, NOT NULL, ON DELETE CASCADE | |
| menu_item_id | `uuid` | FK → menu_items.id, nullable | Nullable in case item is later deleted |
| item_name_snapshot | `text` | NOT NULL | Copied from menu_items.name at order time |
| item_price_snapshot | `numeric(10,2)` | NOT NULL | Copied from menu_items.price at order time |
| quantity | `integer` | NOT NULL, CHECK (> 0) | |

**RLS**: Public insert-only (within order creation); staff full read.
**Validation (Zod)**: `menu_item_id` valid UUID (nullable);
`item_name_snapshot` min 1; `item_price_snapshot` positive;
`quantity` positive integer.

---

## Profile

Staff user record linked to Supabase Auth.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | `uuid` | PK, FK → auth.users(id) ON DELETE CASCADE | Matches Supabase Auth user id |
| role | `text` | NOT NULL, CHECK IN ('staff', 'admin') | |
| name | `text` | NOT NULL | Display name |
| created_at | `timestamptz` | NOT NULL, default `now()` | |

**RLS**: Staff full access (read + write for admins). Customers never
have a profile record. The `role` column is used in middleware and
server actions to gate admin operations.
**Validation (Zod)**: `name` min 1, max 100; `role` must be 'staff' or
'admin'. `id` must match authenticated user ID (set server-side, never
from client input).

---

## Cross-Cutting Notes

- All tables have RLS enabled at creation time (Supabase project
  setting). Policies MUST be defined in the same migration step as
  table creation.
- Timestamps use `timestamptz` (TIMESTAMP WITH TIME ZONE).
- `reference_number` format: `RDC-` prefix + 8 uppercase alphanumeric
  characters generated via `encode(gen_random_bytes(6), 'hex')` or
  similar collision-resistant approach.
- The Zod schemas in `src/lib/schemas/` are the authoritative
  validation layer — shared between React Hook Form client-side checks
  and server action inserts/updates.
