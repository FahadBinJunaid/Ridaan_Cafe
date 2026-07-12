import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import Receipt from "@/components/shared/receipt";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ reference: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { reference } = await params;
  return {
    title: `Order ${reference}`,
    description: `Order confirmation for ${reference}.`,
  };
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { reference } = await params;
  const supabase = createServiceClient();

  const { data: order } = await supabase
    .from("orders")
    .select("id, reference_number, customer_name, customer_phone, delivery_address, notes, total_amount, order_status, created_at")
    .eq("reference_number", reference)
    .single();

  if (!order) notFound();

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("item_name_snapshot, item_price_snapshot, quantity")
    .eq("order_id", order.id);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/menu"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Back to Menu
        </Link>
      </div>

      <Receipt
        referenceNumber={order.reference_number}
        customerName={order.customer_name}
        customerPhone={order.customer_phone}
        deliveryAddress={order.delivery_address}
        notes={order.notes}
        items={(orderItems ?? []).map((item) => ({
          name: item.item_name_snapshot,
          quantity: item.quantity,
          price: Number(item.item_price_snapshot),
        }))}
        totalAmount={Number(order.total_amount)}
        orderStatus={order.order_status}
        createdAt={order.created_at}
      />
    </main>
  );
}
