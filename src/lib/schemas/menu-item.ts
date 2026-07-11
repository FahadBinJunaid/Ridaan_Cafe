import { z } from "zod";

export const createMenuItemSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name must be 200 characters or less"),
  description: z.string().optional().default(""),
  price: z.coerce.number().positive("Price must be greater than 0"),
  category_id: z.string().uuid("Invalid category"),
  image_url: z.string().optional().default(""),
});

export const updateMenuItemSchema = createMenuItemSchema.extend({
  id: z.string().uuid(),
});

export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
