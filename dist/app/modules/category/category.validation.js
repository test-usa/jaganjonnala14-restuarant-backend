"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryPostValidation = void 0;
const zod_1 = require("zod");
exports.categoryPostValidation = zod_1.z.object({
    restaurant: zod_1.z
        .string()
        .min(1, { message: "Restaurant ID is required" })
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid MongoDB ObjectId" }),
    categoryName: zod_1.z
        .string()
        .min(1, { message: "Category name is required" }),
    description: zod_1.z.string().optional().default(""),
    image: zod_1.z
        .string()
        .optional()
        .default(""),
    isDeleted: zod_1.z.boolean().optional().default(false),
});
