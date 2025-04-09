// categories.validation.ts - categories module
import { z } from "zod";

// Category Validation Schema
export const categoryValidationSchema = z.object({
  name: z.string().min(1, "Category name is required").trim(),
  type: z.enum(["parent", "category", "subcategory"]),
  parentCategory: z.string().optional().nullable(), // Only applicable for "category" and "subcategory"
  category: z.string().optional().nullable(), // Only applicable for "category" and "subcategory"
  categories: z.array(z.string()).optional(), // Only applicable for "parent"
  subcategories: z.array(z.string()).optional(), // Only applicable for "category"
  description: z.string().trim().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  isDelete: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),

});

export const editCategoryValidationSchema = categoryValidationSchema.partial()
