"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { updateOrderStatus } from "@/actions/update-order-status";

type OrderRow = {
  id: string;
  reference_number: string;
  customer_name: string;
  customer_phone: string;
  order_status: string;
  total_amount: number;
  created_at: string;
};

type DashboardProps = {
  initialOrders: OrderRow[];
  totalPages: number;
  currentPage: number;
  searchQuery: string;
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-800",
};

const NEXT_STATUSES: Record<string, { label: string; value: string }[]> = {
  pending: [
    { label: "Mark Preparing", value: "preparing" },
    { label: "Cancel", value: "cancelled" },
  ],
  preparing: [
    { label: "Mark Ready", value: "ready" },
    { label: "Cancel", value: "cancelled" },
  ],
  ready: [
    { label: "Mark Completed", value: "completed" },
    { label: "Cancel", value: "cancelled" },
  ],
  completed: [],
  cancelled: [],
};

function playBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {
  }
}

export default function AdminOrderDashboard({
  initialOrders,
  totalPages,
  currentPage,
  searchQuery,
}: DashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<OrderRow[]>(initialOrders);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const audioUnlockedRef = useRef(false);
  const [toast, setToast] = useState<OrderRow | null>(null);
  const [statusMsg, setStatusMsg] = useState<{
    id: string;
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    audioUnlockedRef.current = audioUnlocked;
  }, [audioUnlocked]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("admin-orders-insert")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const newOrder = payload.new as OrderRow;
          setOrders((prev) => [newOrder, ...prev]);
          setToast(newOrder);
          if (audioUnlockedRef.current) {
            playBeep();
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const unlockAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    audioCtxRef.current.resume().then(() => {
      setAudioUnlocked(true);
    });
  }, []);

  function handleSearchChange(value: string) {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      params.set("page", "1");
      router.push(`/admin?${params.toString()}`);
    }, 300);
  }

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/admin?${params.toString()}`);
  }

  async function handleStatusChange(orderId: string, newStatus: string) {
    setLoadingOrderId(orderId);
    const fd = new FormData();
    fd.set("orderId", orderId);
    fd.set("orderStatus", newStatus);

    const res = await updateOrderStatus(fd);
    if ("error" in res && res.error) {
      setStatusMsg({
        id: orderId,
        type: "error",
        text: typeof res.error === "string" ? res.error : "Update failed",
      });
    } else {
      setStatusMsg({ id: orderId, type: "success", text: "Updated" });
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, order_status: newStatus } : o,
        ),
      );
    }
    setLoadingOrderId(null);
    setTimeout(() => setStatusMsg(null), 3000);
  }

  return (
    <div>
      {!audioUnlocked && (
        <div className="mb-4 rounded-lg border border-blue-500/50 bg-blue-500/10 px-4 py-3 text-sm text-blue-700">
          Enable notifications for new orders:{" "}
          <button
            type="button"
            onClick={unlockAudio}
            className="ml-2 rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
          >
            Enable Alerts
          </button>
        </div>
      )}

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by customer name or phone..."
          className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              router.push("/admin");
            }}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            Clear
          </button>
        )}
      </div>

      {toast && (
        <div className="mb-4 animate-pulse rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-3 text-sm text-green-700">
          <span className="font-semibold">New order!</span>{" "}
          {toast.customer_name} —{" "}
          <span className="font-mono">{toast.reference_number}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-4 text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border transition-colors hover:bg-accent/50"
              >
                <td className="px-4 py-3">
                  <a
                    href={`/admin/orders/${order.id}`}
                    className="font-mono text-sm text-primary hover:underline"
                  >
                    {order.reference_number}
                  </a>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  {order.customer_name}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {order.customer_phone}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      STATUS_COLORS[order.order_status] || ""
                    }`}
                  >
                    {STATUS_LABELS[order.order_status] || order.order_status}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  Rs. {Number(order.total_amount).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </td>
                <td className="px-4 py-3">
                  {statusMsg?.id === order.id ? (
                    <span
                      className={`text-xs ${
                        statusMsg.type === "error"
                          ? "text-destructive"
                          : "text-green-600"
                      }`}
                    >
                      {statusMsg.text}
                    </span>
                  ) : NEXT_STATUSES[order.order_status]?.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {NEXT_STATUSES[order.order_status].map((action) => (
                          <button
                            key={action.value}
                            type="button"
                            disabled={loadingOrderId === order.id}
                            onClick={() =>
                              handleStatusChange(order.id, action.value)
                            }
                            className={`rounded px-2 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50 ${
                              action.value === "cancelled"
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-primary/10 text-primary hover:bg-primary/20"
                            }`}
                          >
                            {loadingOrderId === order.id ? "Updating..." : action.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  {searchQuery
                    ? "No orders match your search."
                    : "No orders yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => goToPage(currentPage - 1)}
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => goToPage(p)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                p === currentPage
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground hover:bg-accent"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => goToPage(currentPage + 1)}
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
