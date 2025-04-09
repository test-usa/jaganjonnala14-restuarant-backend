"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editCategoryValidationSchema = exports.categoryValidationSchema = void 0;
// categories.validation.ts - categories module
const zod_1 = require("zod");
// Category Validation Schema
exports.categoryValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Category name is required").trim(),
    type: zod_1.z.enum(["parent", "category", "subcategory"]),
    parentCategory: zod_1.z.string().optional().nullable(), // Only applicable for "category" and "subcategory"
    category: zod_1.z.string().optional().nullable(), // Only applicable for "category" and "subcategory"
    categories: zod_1.z.array(zod_1.z.string()).optional(), // Only applicable for "parent"
    subcategories: zod_1.z.array(zod_1.z.string()).optional(), // Only applicable for "category"
    description: zod_1.z.string().trim().optional(),
    status: zod_1.z.enum(["active", "inactive"]).default("active"),
    isDelete: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.date().default(() => new Date()),
    updatedAt: zod_1.z.date().default(() => new Date()),
});
exports.editCategoryValidationSchema = exports.categoryValidationSchema.partial();
