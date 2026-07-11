import type { Metadata } from "next";
import MenuContent from "@/components/shared/menu-content";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Full Menu",
  description:
    "Browse the full menu at Rindaan Cafe & Cuisine — Pakistani Dhaba-style starters, fast food, barbeque, and more.",
};

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
};

type MenuCategory = {
  name: string;
  slug: string;
  items: MenuItem[];
};

export default async function MenuPage() {
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("display_order");

  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("id, category_id, name, description, price")
    .eq("is_available", true);

  const categoryMap = new Map<string, MenuCategory>();
  for (const cat of categories ?? []) {
    categoryMap.set(cat.id, {
      name: cat.name,
      slug: cat.name.toLowerCase().replace(/\s+/g, "-"),
      items: [],
    });
  }
  for (const item of menuItems ?? []) {
    categoryMap.get(item.category_id)?.items.push({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
    });
  }

  const menuCategories = Array.from(categoryMap.values());

  if (menuCategories.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-foreground">Full Menu</h1>
        <p className="text-muted-foreground">No menu items available at this time. Please check back later.</p>
      </main>
    );
  }

  return <MenuContent categories={menuCategories} />;
}
