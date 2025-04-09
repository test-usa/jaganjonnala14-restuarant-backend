// attribute.validation.ts - attribute module
import { z } from "zod";
import { Types } from "mongoose";

export const AttributeValidationPostSchema = z.object({
  name: z.string().min(1, "Name is required"),
  attributeOption: z
    .array(z.string().refine((id) => Types.ObjectId.isValid(id), "Invalid ObjectId"))
    .min(1, "At least one attribute option is required").optional(),
  isDelete: z.boolean().optional(), // Optional since default is `false`
});

export const AttributeValidationPutSchema = AttributeValidationPostSchema.partial()
