"use client";

import { useState } from "react";
import Link from "next/link";
import Receipt from "@/components/shared/receipt";
import { updateOrderStatus } from "@/actions/update-order-status";

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

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
};

const LEGAL_TRANSITIONS: Record<string, string[]> = {
  pending: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export default function AdminOrderDetail({
  order,
  items,
}: {
  order: OrderRow;
  items: OrderItemRow[];
}) {
  const [currentStatus, setCurrentStatus] = useState(order.order_status);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const receiptItems = items.map((item) => ({
    name: item.item_name_snapshot,
    quantity: item.quantity,
    price: Number(item.item_price_snapshot),
  }));

  async function handleStatusChange(newStatus: string) {
    const fd = new FormData();
    fd.set("orderId", order.id);
    fd.set("orderStatus", newStatus);

    const res = await updateOrderStatus(fd);
    if ("error" in res && res.error) {
      setStatusMsg({
        type: "error",
        text: typeof res.error === "string" ? res.error : "Update failed",
      });
    } else {
      setCurrentStatus(newStatus);
      setStatusMsg({ type: "success", text: "Status updated" });
    }
    setTimeout(() => setStatusMsg(null), 3000);
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin"
          className="text-sm text-primary hover:underline"
        >
          &larr; Back to Orders
        </Link>
      </div>

      <div className="mb-6 rounded-lg border border-border bg-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Order {order.reference_number}
            </h1>
            <p className="text-sm text-muted-foreground">
              Placed on{" "}
              {new Date(order.created_at).toLocaleString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                currentStatus === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : currentStatus === "preparing"
                    ? "bg-blue-100 text-blue-800"
                    : currentStatus === "ready"
                      ? "bg-green-100 text-green-800"
                      : currentStatus === "completed"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-red-100 text-red-800"
              }`}
            >
              {STATUS_LABELS[currentStatus]}
            </span>

            {LEGAL_TRANSITIONS[currentStatus]?.length > 0 && (
              <div className="flex gap-2">
                {LEGAL_TRANSITIONS[currentStatus].map((next) => (
                  <button
                    key={next}
                    type="button"
                    onClick={() => handleStatusChange(next)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      next === "cancelled"
                        ? "border border-destructive text-destructive hover:bg-destructive/10"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {next === "preparing"
                      ? "Start Preparing"
                      : next === "ready"
                        ? "Mark Ready"
                        : next === "completed"
                          ? "Complete"
                          : "Cancel Order"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {statusMsg && (
          <div
            className={`mt-4 rounded-lg border px-4 py-2 text-sm ${
              statusMsg.type === "success"
                ? "border-green-500/50 bg-green-500/10 text-green-700"
                : "border-destructive/50 bg-destructive/10 text-destructive"
            }`}
          >
            {statusMsg.text}
          </div>
        )}
      </div>

      <Receipt
        referenceNumber={order.reference_number}
        customerName={order.customer_name}
        customerPhone={order.customer_phone}
        deliveryAddress={order.delivery_address}
        notes={order.notes}
        items={receiptItems}
        totalAmount={Number(order.total_amount)}
        orderStatus={currentStatus}
        createdAt={order.created_at}
      />
    </div>
  );
}
