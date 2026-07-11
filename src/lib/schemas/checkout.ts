import { z } from "zod";

export const checkoutItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

export const checkoutSchema = z.object({
  customer_name: z.string().min(1, "Name is required").max(100),
  customer_phone: z
    .string()
    .min(10, "Phone must be at least 10 characters")
    .max(20),
  delivery_address: z.string().min(1, "Address is required").max(500),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
