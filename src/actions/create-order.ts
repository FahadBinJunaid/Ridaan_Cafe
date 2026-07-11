"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { checkoutSchema } from "@/lib/schemas/checkout";

const REF_PREFIX = "RDC-";
const REF_LENGTH = 8;
const REF_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateReference(): string {
  let result = REF_PREFIX;
  for (let i = 0; i < REF_LENGTH; i++) {
    result += REF_CHARS.charAt(Math.floor(Math.random() * REF_CHARS.length));
  }
  return result;
}

export type CreateOrderResult =
  | { success: true; reference_number: string }
  | { success: false; error: string };

const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 60_000;

export async function createOrder(
  _prev: unknown,
  formData: FormData,
): Promise<CreateOrderResult> {
  try {
    const raw: Record<string, unknown> = {};
    const formItems: Record<string, unknown>[] = [];
    for (const [key, value] of formData.entries()) {
      const match = key.match(/items\[(\d+)\]\.(\w+)/);
      if (match) {
        const idx = parseInt(match[1]);
        const field = match[2];
        if (!formItems[idx]) formItems[idx] = {};
        formItems[idx][field] =
          field === "price" || field === "quantity"
            ? Number(value)
            : value;
      } else {
        raw[key] = value;
      }
    }
    raw.items = formItems.filter(Boolean);

    const parsed = checkoutSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues.map((e) => e.message).join("; "),
      };
    }

    const { customer_name, customer_phone, delivery_address, notes, items } =
      parsed.data;

    const lastOrder = rateLimitMap.get(customer_phone);
    if (lastOrder && Date.now() - lastOrder < RATE_LIMIT_MS) {
      return {
        success: false,
        error:
          "Please wait at least 60 seconds before placing another order from the same phone number.",
      };
    }

    const supabase = createServiceClient();
    let reference_number = generateReference();

    for (let attempt = 0; attempt < 3; attempt++) {
      const { data: existing } = await supabase
        .from("orders")
        .select("id")
        .eq("reference_number", reference_number)
        .maybeSingle();
      if (!existing) break;
      reference_number = generateReference();
    }

    const total_amount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        reference_number,
        customer_name,
        customer_phone,
        delivery_address,
        notes: notes || null,
        total_amount,
        payment_status: "cod_pending",
        order_status: "pending",
      })
      .select("id")
      .single();

    if (orderError || !order) {
      return { success: false, error: "Failed to create order. Please try again." };
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      menu_item_id: item.id,
      item_name_snapshot: item.name,
      item_price_snapshot: item.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      await supabase.from("orders").delete().eq("id", order.id);
      return {
        success: false,
        error: "Failed to save order items. Please try again.",
      };
    }

    rateLimitMap.set(customer_phone, Date.now());

    return { success: true, reference_number };
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
