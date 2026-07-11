"use client";

import Link from "next/link";
import { useCartStore, selectCartCount } from "@/lib/store/cart";

export default function SiteHeader() {
  const totalItems = useCartStore(selectCartCount);

  return (
    <header className="w-full border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-primary">
          Rindaan Cafe &amp; Cuisine
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-4">
          <Link
            href="/menu"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Full Menu
          </Link>
          <Link
            href="/cart"
            className="relative text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Cart
            {totalItems > 0 && (
              <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
