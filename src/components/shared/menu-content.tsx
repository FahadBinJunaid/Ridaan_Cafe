"use client";

import { useState, useMemo } from "react";
import MenuItemCard from "@/components/shared/menu-item-card";

type MenuItem = {
  name: string;
  description: string;
  price: number;
};

type MenuCategory = {
  name: string;
  slug: string;
  items: MenuItem[];
};

type Props = {
  categories: MenuCategory[];
};

export default function MenuContent({ categories }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((item) => {
          const matchesSearch =
            !query ||
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query);
          const matchesCategory =
            !selectedCategory || cat.slug === selectedCategory;
          return matchesSearch && matchesCategory;
        }),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [categories, searchQuery, selectedCategory]);

  const totalFilteredItems = filteredCategories.reduce(
    (sum, cat) => sum + cat.items.length,
    0,
  );

  const categoryButtons = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
  }));

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-foreground">Full Menu</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Search menu items"
        />
      </div>

      <div
        className="mb-8 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter by category"
      >
        <button
          onClick={() => setSelectedCategory(null)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            selectedCategory === null
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          All
        </button>
        {categoryButtons.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedCategory === cat.slug
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {totalFilteredItems === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg text-muted-foreground">
            No items found
            {searchQuery && selectedCategory
              ? ` matching "${searchQuery}" in this category.`
              : searchQuery
                ? ` matching "${searchQuery}".`
                : " in this category."}
          </p>
        </div>
      ) : (
        filteredCategories.map((category) => (
          <section
            key={category.slug}
            id={category.slug}
            className="mb-10 scroll-mt-20"
          >
            <h2 className="mb-4 border-b border-border pb-2 text-2xl font-semibold text-foreground">
              {category.name}
            </h2>
            <div className="space-y-4">
              {category.items.map((item, idx) => (
                <MenuItemCard
                  key={`${category.slug}-${idx}`}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </main>
  );
}
