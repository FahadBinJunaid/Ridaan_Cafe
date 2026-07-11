# Server Action Contracts

**Phase**: 1 — Design & Contracts
**Date**: 2026-07-11

All mutations use Next.js Server Actions (no manual API route handlers
per Constitution Principle III). Each action is a standalone async
function in `src/actions/`. Input validated with the shared Zod schema;
database writes go through the Supabase server client (service role).

---

## `create-order`

**File**: `src/actions/create-order.ts`

**Purpose**: Create a new order with its line items.

**Input** (validated via `checkoutSchema` from `src/lib/schemas/checkout.ts`):

```typescript
{
  customer_name: string;       // 1–100 chars
  customer_phone: string;      // 10–20 chars (digits, +, -, spaces)
  delivery_address: string;    // 1–500 chars
  notes?: string;              // 0–500 chars, optional
  items: Array<{
    menu_item_id: string;      // UUID from menu_items
    name: string;              // snapshot from menu_items at order time
    price: number;             // snapshot from menu_items at order time
    quantity: number;          // > 0
  }>;
}
```

**Logic**:
1. Validate input with shared Zod schema.
2. Check rate limit: reject if same `customer_phone` has an order
   within the last 60 seconds.
3. Generate unique `reference_number` (e.g. `RDC-` + 8 alphanumeric).
4. Compute `total_amount = SUM(item.price * item.quantity)`.
5. Insert `orders` row with `payment_status = 'cod_pending'`,
   `order_status = 'pending'`.
6. Insert `order_items` rows (one per line item) linked to the new
   order ID.
7. Return `{ success: true, reference_number }`.

**Error responses**:
- `{ success: false, error: "Cart is empty" }` — if `items` is empty.
- `{ success: false, error: "Please wait before placing another order" }`
  — if rate-limited.
- `{ success: false, error: "Validation failed", fields: {...} }` — if
  Zod validation fails.

**RLS note**: Public `INSERT` policy on `orders` and `order_items`
allows this to work for anonymous users. The server client uses the
service role key for the admin-side read/update operations only.

---

## `update-order-status`

**File**: `src/actions/update-order-status.ts`

**Purpose**: Transition an order's `order_status`.

**Input**:
```typescript
{
  order_id: string;            // UUID
  new_status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
}
```

**Logic**:
1. Validate status transition is legal per state machine
   (data-model.md).
2. Update `orders SET order_status = new_status WHERE id = order_id`.
3. If `new_status = 'cancelled'`, also set
   `payment_status = 'cancelled'`.

**Auth**: Requires authenticated session with `role IN ('staff', 'admin')`.

**Error responses**:
- `{ success: false, error: "Unauthorized" }` — if no valid session.
- `{ success: false, error: "Invalid status transition" }` — if
   transition is not allowed (e.g. `pending` → `completed`).

---

## `manage-category`

**File**: `src/actions/manage-category.ts`

**Purpose**: Create, update, or delete a category.

**Action types**:

### `create`
**Input**: `{ name: string; display_order: number }` (validated via
`categorySchema`).

**Logic**: Insert row into `categories`. Return new category ID.

### `update`
**Input**: `{ id: string; name?: string; display_order?: number }`.

**Logic**: Update matching row. Only provided fields are changed.

### `delete`
**Input**: `{ id: string }`.

**Logic**: Check if any `menu_items` reference this category. If yes,
return error `"Cannot delete category with existing menu items.
Reassign or delete them first."`. Otherwise delete the category row.

**Auth**: Requires authenticated session with `role IN ('staff', 'admin')`.

---

## `manage-menu-item`

**File**: `src/actions/manage-menu-item.ts`

**Purpose**: Create, update, or delete a menu item.

**Action types**:

### `create`
**Input**: `{ category_id, name, description, price, image_url? }`
(validated via `menuItemSchema`).

**Logic**: Insert row into `menu_items`. `is_available` defaults to
`true`.

### `update`
**Input**: `{ id, category_id?, name?, description?, price?,
image_url?, is_available? }`.

**Logic**: Update matching row. `updated_at` set to current timestamp.

### `delete`
**Input**: `{ id: string }`.

**Logic**: Delete row. Previous references in `order_items` are
preserved (FK is nullable; `menu_item_id` set to NULL on delete or
cascade not used — the snapshot data remains).

### `toggle-availability`
**Input**: `{ id: string; is_available: boolean }`.

**Logic**: Flip `is_available`. Public menu queries filter on this
column — no data loss.

**Auth**: Requires authenticated session with `role IN ('staff', 'admin')`.

---

## `get-cloudinary-signature`

**File**: `src/actions/get-cloudinary-signature.ts`

**Purpose**: Generate a signed upload signature for the admin
image-upload widget.

**Input**: `{ public_id?: string }` (optional, for overwriting).

**Logic**:
1. Generate a timestamp and a signature using
   `cloudinary.utils.api_sign_request({ timestamp, ... }, CLOUDINARY_API_SECRET)`.
2. Return `{ signature, timestamp, cloud_name, api_key }`.

**Output**:
```typescript
{
  signature: string;
  timestamp: number;
  cloud_name: string;           // NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  api_key: string;              // CLOUDINARY_API_KEY
}
```

**Auth**: Requires authenticated session with `role IN ('staff', 'admin')`.
