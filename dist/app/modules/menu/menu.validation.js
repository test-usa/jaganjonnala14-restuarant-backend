"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuUpdateValidation = exports.menuPostValidation = void 0;
const zod_1 = require("zod");
const sizeEnum = zod_1.z.enum(["small", "medium", "large"]);
exports.menuPostValidation = zod_1.z.object({
    category: zod_1.z
        .string({ required_error: "Category ID is required" })
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Category ID" }),
    restaurant: zod_1.z
        .string({ required_error: "Restaurant ID is required" })
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Restaurant ID" }),
    itemName: zod_1.z.string().min(1, { message: "Item name is required" }),
    image: zod_1.z
        .string()
        .optional()
        .default(""),
    price: zod_1.z.number({ required_error: "Price is required" }),
    size: sizeEnum,
    availability: zod_1.z.boolean().optional().default(true),
    description: zod_1.z.string().optional().default(""),
    rating: zod_1.z.number().optional().default(0),
    like: zod_1.z.number().optional().default(0),
    isDeleted: zod_1.z.boolean().optional().default(false),
});
// PATCH validation (partial update)
exports.menuUpdateValidation = exports.menuPostValidation.partial();
