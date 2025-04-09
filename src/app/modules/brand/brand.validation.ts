// brand.validation.ts - brand module
import { z } from "zod";

export const BrandValidation = z.object({
  name: z.string().min(1, "Brand name is required"),
  isFeatured: z.string(),
  status: z.enum(["active", "Inactive"]).default("active"),
  isDelete: z.boolean().default(false),
});

export const BrandValidationPut = BrandValidation.partial()
