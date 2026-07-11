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
      <article className="flex gap-4 rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:bg-accent/50">
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${name} — food item`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl text-muted-foreground">
              🍽
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h3 className="font-semibold text-foreground">{name}</h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="font-bold text-primary">
              Rs. {price.toFixed(2)}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem({ id, name, price });
              }}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
