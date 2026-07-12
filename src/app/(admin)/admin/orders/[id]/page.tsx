import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import AdminOrderDetail from "@/components/shared/admin-order-detail";

type OrderItemRow = {
  id: string;
  menu_item_id: string | null;
  item_name_snapshot: string;
  item_price_snapshot: number;
  quantity: number;
};

type OrderRow = {
  id: string;
  reference_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  notes: string | null;
  payment_status: string;
  order_status: string;
  total_amount: number;
  created_at: string;
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createServiceClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, reference_number, customer_name, customer_phone, delivery_address, notes, payment_status, order_status, total_amount, created_at")
    .eq("id", id)
    .single();

  if (orderError || !order) {
    notFound();
  }

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("id, menu_item_id, item_name_snapshot, item_price_snapshot, quantity")
    .eq("order_id", id)
    .order("item_name_snapshot", { ascending: true });

  return (
    <div>
      <AdminOrderDetail
        order={order as OrderRow}
        items={(orderItems as OrderItemRow[]) || []}
      />
    </div>
  );
}
