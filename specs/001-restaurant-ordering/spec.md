# Feature Specification: Restaurant Ordering Website — Rindaan Cafe & Cuisine

**Feature Branch**: `001-restaurant-ordering`
**Created**: 2026-07-11
**Status**: Draft
**Input**: User description

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Browse Menu and Place a Takeaway Order (Priority: P1)

A guest visitor lands on the homepage, browses the menu by category or
text search, views food details, adds items to cart, and places a COD
order without creating an account.

**Why this priority**: Order placement is the core revenue-generating
flow. Without it, the website has no business function.

**Independent Test**: A first-time visitor can open the site, find a
dish (e.g. Chicken Biryani), add it to cart, fill in their name, phone,
and address, submit the order, and see an on-screen confirmation with a
receipt. No account creation is required at any step.

**Acceptance Scenarios**:

1. **Given** a guest visitor on the homepage, **When** they view the
   page, **Then** they see a hero section with branding, a row of
   category tiles (loaded from the database), and a Contact/Location
   section.
2. **Given** a visitor clicks a category tile, **When** the page scrolls
   or navigates, **Then** they see only menu items belonging to that
   category in a scrollable view.
3. **Given** a visitor types a search term, **When** they submit the
   search, **Then** matching menu items are displayed (based on name or
   description match).
4. **Given** a visitor taps a menu item, **When** the detail view opens,
   **Then** they see the item's name, description, price, image, and an
   "Add to Cart" button.
5. **Given** a visitor adds an item to cart, **When** they view the
   cart, **Then** they can adjust quantity, remove items, and see a
   running subtotal.
6. **Given** a visitor with a non-empty cart proceeds to checkout,
   **When** they fill in name, phone, delivery address, and optional
   notes, **Then** submitting creates an order with
   `payment_status = "cod_pending"`.
7. **Given** an order is submitted, **When** the confirmation screen
   appears, **Then** the customer sees an order reference number,
   itemised list, total, and a "Print Receipt" option.
8. **Given** a visitor tries to submit with an empty cart, **When** they
   access the checkout, **Then** they see a clear message that the cart
   is empty and are prevented from placing the order.
9. **Given** a visitor submits a form with missing/invalid fields,
   **When** they click submit, **Then** visible inline error messages
   appear for each invalid field and the order is not created.
10. **Given** a visitor rapidly double-taps the submit button, **When**
    the first submission is processing, **Then** duplicate orders are
    not created.

---

### User Story 2 — Admin Menu Management (Priority: P1)

A staff user logs in, manages categories and menu items — adds, edits,
deletes, toggles availability, and uploads images directly through the
admin panel.

**Why this priority**: The menu is the foundation of the ordering
system. Without menu management, the public menu cannot be maintained.

**Independent Test**: An authenticated staff user can log into the admin
panel, create a new category (e.g. "Special Deals"), add a new menu item
under it with a description, price, and uploaded image, then toggle its
availability on/off and confirm the public menu reflects the change
immediately.

**Acceptance Scenarios**:

1. **Given** an authenticated staff user on the admin panel, **When**
   they navigate to menu management, **Then** they see a list of
   categories and menu items with add/edit/delete controls.
2. **Given** a staff user adds a new category, **When** they supply a
   name and display order, **Then** the category appears on the public
   menu in the specified order.
3. **Given** a staff user adds a new menu item, **When** they fill in
   name, description, price, category, and upload an image, **Then** the
   item appears on the public menu immediately.
4. **Given** a staff user toggles an item's availability off, **When**
   they save the change, **Then** the item is hidden from the public
   menu but its data and order history are preserved.
5. **Given** a staff user deletes a category, **When** that category has
   existing menu items, **Then** the system does not silently orphan
   them — the items are either reassigned or the deletion is blocked
   with a clear message.
6. **Given** a staff user edits an existing item, **When** they change
   any field (name, price, image, etc.), **Then** the public menu
   reflects the update immediately.
7. **Given** an unauthenticated visitor attempts to access any admin
   URL, **When** they navigate to an admin path, **Then** they are
   redirected to a login screen and cannot see or modify any data.

---

### User Story 3 — Live Order Dashboard for Staff (Priority: P2)

Staff see incoming orders in real time, search/paginate through the order
list, update order status, and print receipts.

**Why this priority**: Without an order dashboard, staff cannot process
incoming orders efficiently. The live-update and audio-alert features
are critical for a fast-paced restaurant environment.

**Independent Test**: An authenticated staff user can see new orders
appear on the dashboard without refreshing the page, search for a
specific order by customer name, update its status from Pending to
Preparing, and print a receipt.

**Acceptance Scenarios**:

1. **Given** an authenticated staff user on the order dashboard, **When**
   a new order is placed by a customer, **Then** the order appears at
   the top of the list automatically without a page refresh.
2. **Given** a new order arrives, **When** the dashboard is open,
   **Then** a visual alert (e.g. a badge or toast) and an audio alert
   (after first user interaction on the page) notify the staff.
3. **Given** a staff user searches by customer name or phone number,
   **When** they type in the search field, **Then** the order list
   filters on the server-side, returning only matching results.
4. **Given** a staff user views the order list, **When** they scroll or
   navigate pages, **Then** only a limited page of orders is loaded (no
   full-dataset client-side filtering).
5. **Given** a staff user opens an individual order, **When** they view
   its details, **Then** they see the order items, customer info, and
   status, and can update the status through the workflow: Pending →
   Preparing → Ready → Completed (or Cancelled at any point).
6. **Given** a staff user views an order, **When** they click "Print
   Receipt", **Then** the browser's native print dialog opens with a
   formatted receipt matching the customer's confirmation layout.
7. **Given** a staff user navigates away from the dashboard and returns,
   **When** they revisit the dashboard, **Then** Realtime subscriptions
   are set up fresh without duplicate listeners.

---

### User Story 4 — Admin Reports (Priority: P3)

Staff view daily, weekly, monthly, and yearly order/revenue summaries.

**Why this priority**: Reports provide business insights but are not
required for the restaurant to start accepting orders.

**Independent Test**: An authenticated staff user can navigate to the
Reports section and see order count and revenue figures for today, this
week, this month, and this year, with cancelled orders excluded.

**Acceptance Scenarios**:

1. **Given** a staff user on the Reports page, **When** the page loads,
   **Then** they see total orders placed today and the sum of
   `total_amount` for today, this week, this month, and this year.
2. **Given** there are cancelled orders, **When** revenue is calculated,
   **Then** cancelled orders are excluded from all totals.

---

### Edge Cases

- Empty cart at checkout: blocked with a clear message and the submit
  button is disabled.
- Invalid/missing checkout fields: inline error messages shown per
  field; form does not submit.
- Duplicate rapid form submission: the submit action is idempotent —
  duplicate orders are prevented (e.g. button disabled after first click
  or a server-side uniqueness check).
- Realtime subscriptions: on repeated dashboard visits, no duplicate
  listeners; cleanup on unmount is verified.
- Deleting a category with items: the system prevents deletion or
  requires reassignment; items are not silently orphaned.
- Toggling item availability off: the item remains in existing orders
  and order history but is hidden from the public menu.
- Network failure during checkout: the user sees a clear error message
  and can retry without losing their cart contents.
- Unauthenticated access to any admin route: redirect to login; no data
  exposure.
- Zero orders exist: reports show zero values (not an error or blank
  screen).
- Image upload failure: clear error message shown; item can be saved
  without an image.

## Requirements *(mandatory)*

### Functional Requirements

#### Public-Facing (Customer)

- **FR-001**: The homepage MUST display a hero section with the
  restaurant brand name and aesthetic (warm, wooden-texture style).
- **FR-002**: Category tiles on the homepage MUST be loaded dynamically
  from the categories table — no hardcoded category names.
- **FR-003**: A Contact/Location section MUST show the restaurant name,
  address, phone number, and operating hours. These values MUST use
  clearly marked placeholder text (the client will supply real values
  before launch).
- **FR-004**: Clicking a category tile MUST jump the user to that
  category's section within a full scrollable menu page.
- **FR-005**: Users MUST be able to search menu items by text (matching
  name or description).
- **FR-006**: Users MUST be able to filter menu items by category.
- **FR-007**: Each menu item MUST have a detail view showing its name,
  description, price, image, and an "Add to Cart" button.
- **FR-008**: The cart MUST allow adding items, removing items, and
  adjusting quantities. The subtotal MUST update in real time (client-
  side only).
- **FR-009**: Checkout MUST require only: customer name, phone number,
  delivery address, and optional notes. Payment is Cash on Delivery
  only.
- **FR-010**: Submitting an order MUST create a database record with
  `payment_status = "cod_pending"` and generate a unique order reference
  number.
- **FR-011**: After successful submission, an on-screen confirmation
  MUST show the order reference number, itemised list, and total.
- **FR-012**: The confirmation screen MUST provide a "Print Receipt"
  option that opens the browser's native print dialog.
- **FR-013**: Items with `available = false` MUST NOT appear on the
  public menu.

#### Admin-Facing (Staff)

- **FR-014**: Staff MUST authenticate via Supabase Auth. The profiles
  table MUST distinguish staff/admin roles. Customers never receive an
  account or role.
- **FR-015**: Staff MUST be able to add, edit, and delete categories
  (name + display order).
- **FR-016**: Staff MUST be able to add, edit, and delete menu items
  (name, description, price, category, image, availability toggle).
- **FR-017**: Images MUST be uploaded from the admin panel directly to
  Cloudinary via signed upload — no manual file-hosting steps.
- **FR-018**: Toggling an item's availability off MUST immediately hide
  it from the public menu without deleting its data or affecting
  existing order history.
- **FR-019**: The order dashboard MUST display a live-updating order
  list (newest first) using Supabase Realtime — new orders appear
  without a page refresh.
- **FR-020**: A visual alert and an audio alert MUST notify staff of
  new orders. The audio alert requires one prior user interaction on the
  page (browser autoplay policy).
- **FR-021**: The order list MUST support server-side text search by
  customer name or phone number.
- **FR-022**: The order list MUST be paginated server-side — never load
  the entire dataset at once.
- **FR-023**: Staff MUST be able to update order status: Pending →
  Preparing → Ready → Completed (or Cancelled at any step).
- **FR-024**: Staff MUST be able to view and print a receipt for any
  order (same layout as the customer's confirmation receipt).
- **FR-025**: The Reports section MUST show total orders and revenue for
  today, this week, this month, and this year, calculated from
  `total_amount` and excluding cancelled orders.
- **FR-026**: Deleting a category with existing menu items MUST either
  be blocked with a clear message or require reassignment of items to
  another category.

### Non-Functional Requirements

- **NFR-001 (Mobile-first)**: The system MUST be fully responsive across
  mobile, tablet, and desktop viewports.
- **NFR-002 (SEO)**: Every public page MUST use Next.js Metadata API
  for title and description. The homepage MUST include Restaurant
  JSON-LD structured data. A `sitemap.xml` MUST be generated. Open Graph
  tags MUST be present for social link previews. All images MUST have
  descriptive alt text. A favicon MUST be set.
- **NFR-003 (Custom Error Pages)**: Custom `not-found.tsx` (404) and
  `error.tsx` (error boundary) pages MUST exist, styled consistently
  with the site theme.
- **NFR-004 (Performance)**: Cloudinary MUST deliver responsively sized
  images. Framer Motion MUST be used only for hero/card micro-animations
  (sparingly). No significant layout shift MUST occur during page load.
- **NFR-005 (Security)**: Supabase RLS MUST be configured on all tables.
  Public users can only read `menu_items` and `categories`; insert-only
  on `orders`. Staff only can write to `categories`, `menu_items`, and
  have full access to `orders` and `profiles`. Basic rate-limiting on
  order creation is required.
- **NFR-006 (Accessibility)**: The site MUST be keyboard-navigable,
  maintain sufficient color contrast, and provide proper form labels and
  focus indicators.
- **NFR-007 (Offline/Error Resilience)**: Every server action and data
  fetch MUST handle failure gracefully with a clear user-facing message.
  No blank screens or unhandled promise rejections.

### Key Entities

- **Category**: Represents a food category (e.g. Starters, Barbeque).
  Attributes: name, display_order, created_at.
- **Menu Item**: A single dish. Attributes: name, description, price,
  category_id (FK to Category), image_url, available (boolean),
  created_at.
- **Order**: A customer's order. Attributes: reference_number (unique),
  customer_name, customer_phone, delivery_address, notes, items_snapshot
  (JSON — itemised list at time of order), total_amount, payment_status
  (set to "cod_pending"), order_status (Pending/Preparing/Ready/
  Completed/Cancelled), created_at.
- **Profile**: Staff user record. Attributes: id (FK to Supabase Auth
  users), role (staff/admin), created_at. Customers never have a
  profile record.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can browse the menu, add an item to
  cart, and complete checkout in under 3 minutes without creating an
  account or encountering an error.
- **SC-002**: An authenticated staff user can create a new category, add
  a menu item with an uploaded image, and see it appear on the public
  menu within 30 seconds.
- **SC-003**: New orders appear on the staff dashboard within 2 seconds
  of submission, with both visual and (after interaction) audio alerts.
- **SC-004**: The public site achieves a Lighthouse Performance score of
  85+ and an Accessibility score of 90+ on mobile.
- **SC-005**: Zero console errors or warnings during normal use across
  all user flows.
- **SC-006**: All RLS policies pass manual testing — restricted actions
  (e.g. public user attempting to modify menu_items) are confirmed
  blocked, not just that allowed actions work.
- **SC-007**: The site renders correctly and is fully functional on real
  mobile devices (iOS Safari, Android Chrome), not just a resized
  desktop browser window.
- **SC-008**: Duplicate rapid form submission does not result in
  duplicate orders (tested by clicking submit twice rapidly).
