"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/supabase/admin-auth";

const LEGAL_TRANSITIONS: Record<string, string[]> = {
  pending: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export async function updateOrderStatus(formData: FormData) {
  try {
    await requireStaff();
  } catch {
    return { error: "Unauthorized" };
  }

  const orderId = formData.get("orderId") as string;
  const newStatus = formData.get("orderStatus") as string;

  if (!orderId || !newStatus) {
    return { error: "Missing order ID or status" };
  }

  const validStatuses = [
    "pending",
    "preparing",
    "ready",
    "completed",
    "cancelled",
  ];
  if (!validStatuses.includes(newStatus)) {
    return { error: `Invalid status: ${newStatus}` };
  }

  const supabase = createServiceClient();

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("order_status")
    .eq("id", orderId)
    .single();

  if (fetchError || !order) {
    return { error: "Order not found" };
  }

  const currentStatus = order.order_status;
  const allowed = LEGAL_TRANSITIONS[currentStatus];

  if (!allowed || !allowed.includes(newStatus)) {
    return {
      error: `Cannot transition from "${currentStatus}" to "${newStatus}". Allowed: ${(allowed || []).join(", ") || "none"}`,
    };
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({ order_status: newStatus })
    .eq("id", orderId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders/[id]");

  return { success: true };
}
