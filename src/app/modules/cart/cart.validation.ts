import { z } from "zod";

// Cart Validation Schema
export const cartSchemaValidation = z.object({
  product: z.string(),
  quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
  variant: z.string().optional(), // Validate the Variant data
  price: z.number().min(0, { message: "Price cannot be less than 0" }),
});

export const cartUpdateValidation = cartSchemaValidation.partial();
