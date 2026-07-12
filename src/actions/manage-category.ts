"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  createCategorySchema,
  updateCategorySchema,
} from "@/lib/schemas/category";
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

export async function createCategory(formData: FormData) {
  try {
    await requireStaff();
  } catch {
    return { error: "Unauthorized" };
  }

  const raw = {
    name: formData.get("name"),
    display_order: formData.get("display_order"),
  };

  const parsed = createCategorySchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await getServiceClient();
  const { error } = await supabase.from("categories").insert({
    name: parsed.data.name,
    display_order: parsed.data.display_order,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/menu");
  return { success: true };
}

export async function updateCategory(formData: FormData) {
  try {
    await requireStaff();
  } catch {
    return { error: "Unauthorized" };
  }

  const raw = {
    id: formData.get("id"),
    name: formData.get("name"),
    display_order: formData.get("display_order"),
  };

  const parsed = updateCategorySchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await getServiceClient();
  const { error } = await supabase
    .from("categories")
    .update({
      name: parsed.data.name,
      display_order: parsed.data.display_order,
    })
    .eq("id", parsed.data.id);

  if (error) return { error: error.message };

  revalidatePath("/admin/menu");
  return { success: true };
}

export async function deleteCategory(formData: FormData) {
  try {
    await requireStaff();
  } catch {
    return { error: "Unauthorized" };
  }

  const id = formData.get("id") as string;
  if (!id) return { error: "Missing category ID" };

  const supabase = await getServiceClient();

  const { count } = await supabase
    .from("menu_items")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (count && count > 0) {
    return {
      error: `Cannot delete category with ${count} menu item(s). Remove or reassign items first.`,
    };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/menu");
  return { success: true };
}

export async function getCategories() {
  const supabase = await getServiceClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, display_order")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}
