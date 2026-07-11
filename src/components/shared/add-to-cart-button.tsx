"use client";

import { useCartStore } from "@/lib/store/cart";

type Props = {
  id: string;
  name: string;
  price: number;
  className?: string;
};

export default function AddToCartButton({ id, name, price, className }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <button
      type="button"
      onClick={() => addItem({ id, name, price })}
      className={className ?? "w-full rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"}
    >
      Add to Cart
    </button>
  );
}
