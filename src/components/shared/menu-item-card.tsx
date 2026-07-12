"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";

type MenuItemCardProps = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
};

export default function MenuItemCard({
  id,
  name,
  description,
  price,
  imageUrl,
}: MenuItemCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <Link href={`/menu/${id}`}>
      <article className="group flex gap-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5">
        <div className="h-28 w-28 flex-shrink-0 overflow-hidden bg-muted sm:h-32 sm:w-32">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${name} — food item`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl text-muted-foreground">
              🍽
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-center py-3 pr-4">
          <div>
            <h3 className="font-semibold text-foreground">{name}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-lg font-bold text-primary">
              Rs. {price.toFixed(2)}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem({ id, name, price });
              }}
              className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
