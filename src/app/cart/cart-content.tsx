"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore, selectSubtotal } from "@/lib/store/cart";
import { checkoutSchema, type CheckoutFormData } from "@/lib/schemas/checkout";
import { createOrder, type CreateOrderResult } from "@/actions/create-order";

export default function CartContent() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore(selectSubtotal);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer_name: "",
      customer_phone: "",
      delivery_address: "",
      notes: "",
      items: [],
    },
  });

  const onSubmit = useCallback(
    async (data: CheckoutFormData) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      setServerError(null);

      data.items = items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      }));

      const formData = new FormData();
      formData.append("customer_name", data.customer_name);
      formData.append("customer_phone", data.customer_phone);
      formData.append("delivery_address", data.delivery_address);
      if (data.notes) formData.append("notes", data.notes);
      data.items.forEach((item, idx) => {
        formData.append(`items[${idx}].id`, item.id);
        formData.append(`items[${idx}].name`, item.name);
        formData.append(`items[${idx}].price`, String(item.price));
        formData.append(`items[${idx}].quantity`, String(item.quantity));
      });

      const result: CreateOrderResult = await createOrder(null, formData);
      if (result.success) {
        clearCart();
        router.push(`/order/confirmation/${result.reference_number}`);
      } else {
        setServerError(result.error);
        setIsSubmitting(false);
      }
    },
    [items, clearCart, router, isSubmitting],
  );

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
      <h1 className="mb-8 text-3xl font-bold text-foreground">Your Cart</h1>

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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-4 border-t border-border pt-8"
      >
        <h2 className="text-xl font-semibold text-foreground">
          Delivery Details
        </h2>

        <div>
          <label
            htmlFor="customer_name"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Name *
          </label>
          <input
            id="customer_name"
            {...register("customer_name")}
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.customer_name && (
            <p className="mt-1 text-sm text-destructive">
              {errors.customer_name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="customer_phone"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Phone *
          </label>
          <input
            id="customer_phone"
            type="tel"
            {...register("customer_phone")}
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.customer_phone && (
            <p className="mt-1 text-sm text-destructive">
              {errors.customer_phone.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="delivery_address"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Delivery Address *
          </label>
          <textarea
            id="delivery_address"
            rows={3}
            {...register("delivery_address")}
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.delivery_address && (
            <p className="mt-1 text-sm text-destructive">
              {errors.delivery_address.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="notes"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Order Notes (optional)
          </label>
          <textarea
            id="notes"
            rows={2}
            {...register("notes")}
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-destructive">
              {errors.notes.message}
            </p>
          )}
        </div>

        {serverError && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Placing Order..." : "Place Order — Cash on Delivery"}
        </button>
      </form>

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
