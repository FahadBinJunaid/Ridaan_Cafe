-- T016: orders + order_items tables + RLS

CREATE TABLE IF NOT EXISTS public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_number text NOT NULL UNIQUE,
    customer_name text NOT NULL,
    customer_phone text NOT NULL,
    delivery_address text NOT NULL,
    notes text,
    payment_status text NOT NULL DEFAULT 'cod_pending' CHECK (payment_status IN ('cod_pending', 'cancelled')),
    order_status text NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
    total_amount numeric(10,2) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guests can insert orders"
    ON public.orders
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Staff read orders"
    ON public.orders
    FOR SELECT
    TO authenticated
    USING (public.is_staff());

CREATE POLICY "Staff update orders"
    ON public.orders
    FOR UPDATE
    TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

CREATE TABLE IF NOT EXISTS public.order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id uuid REFERENCES public.menu_items(id),
    item_name_snapshot text NOT NULL,
    item_price_snapshot numeric(10,2) NOT NULL,
    quantity integer NOT NULL CHECK (quantity > 0)
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guests can insert order_items"
    ON public.order_items
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Staff read order_items"
    ON public.order_items
    FOR SELECT
    TO authenticated
    USING (public.is_staff());
