import type { Metadata } from "next";
import CartContent from "./cart-content";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your order before checkout at Rindaan Cafe & Cuisine.",
};

export default function CartPage() {
  return <CartContent />;
}
