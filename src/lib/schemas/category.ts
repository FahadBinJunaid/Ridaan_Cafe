import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  display_order: z.coerce
    .number()
    .int("Must be a whole number")
    .nonnegative("Must be 0 or greater"),
});

export const updateCategorySchema = createCategorySchema.extend({
  id: z.string().uuid(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
