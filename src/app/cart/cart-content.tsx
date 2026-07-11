"use client";

import Link from "next/link";
import { useCartStore, selectSubtotal } from "@/lib/store/cart";

export default function CartContent() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore(selectSubtotal);

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="mb-4 text-3xl font-bold text-foreground">Your Cart</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Your cart is empty.
        </p>
        <Link
          href="/menu"
          className="inline-block rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Browse Menu
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Your Cart</h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm text-muted-foreground underline hover:text-foreground"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{item.name}</h3>
              <p className="text-sm text-muted-foreground">
                Rs. {item.price.toFixed(2)} each
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-8 text-center font-medium text-foreground">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <p className="w-20 text-right font-semibold text-foreground">
              Rs. {(item.price * item.quantity).toFixed(2)}
            </p>

            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="text-sm text-muted-foreground hover:text-destructive"
              aria-label={`Remove ${item.name}`}
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <div className="flex items-center justify-between text-lg">
          <span className="font-semibold text-foreground">Subtotal</span>
          <span className="font-bold text-primary">
            Rs. {subtotal.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href="/menu"
          className="text-sm text-muted-foreground underline hover:text-foreground"
        >
          &larr; Continue Shopping
        </Link>
      </div>
    </main>
  );
}
