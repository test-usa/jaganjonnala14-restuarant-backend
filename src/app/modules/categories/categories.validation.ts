// categories.validation.ts - categories module
import { z } from "zod";

// Category Validation Schema
export const categoryValidationSchema = z.object({
  name: z.string().min(1, "Category name is required").trim(),
  type: z.enum(["parent", "category", "subcategory"]),
  parentCategory: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  categories: z.array(z.string()).optional(),
  subcategories: z.array(z.string()).optional(),
  description: z.string().trim().optional(),
  image: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  isDelete: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const editCategoryValidationSchema = categoryValidationSchema.partial();
