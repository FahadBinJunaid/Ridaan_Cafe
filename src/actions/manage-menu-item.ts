"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  createMenuItemSchema,
  updateMenuItemSchema,
} from "@/lib/schemas/menu-item";
import { requireStaff } from "@/lib/supabase/admin-auth";

async function getServiceClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    },
  );
}

export async function createMenuItem(formData: FormData) {
  try {
    await requireStaff();
  } catch {
    return { error: "Unauthorized" };
  }

  const raw = {
    name: formData.get("name"),
    description: formData.get("description") || "",
    price: formData.get("price"),
    category_id: formData.get("category_id"),
    image_url: formData.get("image_url") || "",
  };

  const parsed = createMenuItemSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await getServiceClient();
  const { error } = await supabase.from("menu_items").insert({
    name: parsed.data.name,
    description: parsed.data.description,
    price: parsed.data.price,
    category_id: parsed.data.category_id,
    image_url: parsed.data.image_url || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/menu");
  return { success: true };
}

export async function updateMenuItem(formData: FormData) {
  try {
    await requireStaff();
  } catch {
    return { error: "Unauthorized" };
  }

  const raw = {
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description") || "",
    price: formData.get("price"),
    category_id: formData.get("category_id"),
    image_url: formData.get("image_url") || "",
  };

  const parsed = updateMenuItemSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await getServiceClient();
  const { error } = await supabase
    .from("menu_items")
    .update({
      name: parsed.data.name,
      description: parsed.data.description,
      price: parsed.data.price,
      category_id: parsed.data.category_id,
      image_url: parsed.data.image_url || null,
    })
    .eq("id", parsed.data.id);

  if (error) return { error: error.message };

  revalidatePath("/admin/menu");
  return { success: true };
}

export async function deleteMenuItem(formData: FormData) {
  try {
    await requireStaff();
  } catch {
    return { error: "Unauthorized" };
  }

  const id = formData.get("id") as string;
  if (!id) return { error: "Missing menu item ID" };

  const supabase = await getServiceClient();
  const { error } = await supabase.from("menu_items").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/menu");
  return { success: true };
}

export async function toggleMenuItem(formData: FormData) {
  try {
    await requireStaff();
  } catch {
    return { error: "Unauthorized" };
  }

  const id = formData.get("id") as string;
  const available = formData.get("available") === "true";

  if (!id) return { error: "Missing menu item ID" };

  const supabase = await getServiceClient();
  const { error } = await supabase
    .from("menu_items")
    .update({ is_available: available })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/menu");
  return { success: true };
}

export async function getMenuItemsForCategory(categoryId: string) {
  const supabase = await getServiceClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select("id, name, description, price, category_id, image_url, is_available")
    .eq("category_id", categoryId)
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function getAllMenuItems() {
  const supabase = await getServiceClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select("id, name, description, price, category_id, image_url, is_available")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}
