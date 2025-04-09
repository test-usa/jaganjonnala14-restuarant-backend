import { z } from 'zod';

export const unitValidation = z.object({
  // Example field (you can adjust based on your model)
  name: z.string().min(1, { message: "Name is required" }),
  // Add other fields based on your model's needs
});

export const unitUpdateValidation = unitValidation.partial(); // This allows partial updates to the unit schema, omitting fields not provided in the request body.
