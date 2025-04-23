import { z } from "zod";

export const attributeOptionPostValidation = z.object({
  name: z.string().trim().min(1, "Name is required"),
  image: z.string().nullable().optional(),
  description: z.string().optional(),
  value: z.string().trim().optional(), // optional since not required in Mongoose
  slug: z.string().trim().optional(),
  isActive: z.boolean().optional().default(true),
  isDelete: z.boolean().optional().default(false),
});

export const attributeOptionUpdateValidation =
  attributeOptionPostValidation.partial();
