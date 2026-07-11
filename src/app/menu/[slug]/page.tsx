import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import AddToCartButton from "@/components/shared/add-to-cart-button";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: item } = await supabase
    .from("menu_items")
    .select("name, description")
    .eq("id", slug)
    .single();

  if (!item) return { title: "Item Not Found" };

  return {
    title: item.name,
    description: item.description,
  };
}

export default async function MenuItemPage({ params }: Props) {
  const { slug } = await params;

  const { data: item } = await supabase
    .from("menu_items")
    .select("id, name, description, price, image_url, category_id")
    .eq("id", slug)
    .single();

  if (!item) notFound();

  const { data: category } = await supabase
    .from("categories")
    .select("name")
    .eq("id", item.category_id)
    .single();

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <nav className="mb-6">
        <Link
          href="/menu"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Back to Menu
        </Link>
      </nav>

      <article>
        <div className="mb-6 overflow-hidden rounded-lg bg-muted">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={`${item.name} — food item`}
              className="h-64 w-full object-cover"
            />
          ) : (
            <div className="flex h-64 w-full items-center justify-center text-6xl text-muted-foreground">
              🍽
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {category?.name ?? "Uncategorized"}
            </p>
            <h1 className="text-3xl font-bold text-foreground">
              {item.name}
            </h1>
          </div>

          <p className="text-base text-muted-foreground">
            {item.description}
          </p>

          <p className="text-2xl font-bold text-primary">
            Rs. {Number(item.price).toFixed(2)}
          </p>

          <AddToCartButton
            id={item.id}
            name={item.name}
            price={Number(item.price)}
            className="w-full rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          />
        </div>
      </article>
    </main>
  );
}
