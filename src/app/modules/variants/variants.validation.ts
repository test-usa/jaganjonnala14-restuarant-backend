import { z } from 'zod';

export const variantsValidation = z.object({
  // Example field (you can adjust based on your model)
  name: z.string().min(1, { message: "Name is required" }),
  available: z.boolean().optional(),
  isDelete: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const variantsUpdateValidation = variantsValidation.partial(); // This allows partial updates to the variants schema, omitting fields not provided in the request body.
