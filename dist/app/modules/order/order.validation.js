"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderUpdateValidation = exports.orderPostValidation = void 0;
const zod_1 = require("zod");
const orderTypeEnum = zod_1.z.enum(["dine in", "takeaway"]);
const statusEnum = zod_1.z.enum(["pending", "inProgress", "delivered", "cancel"]);
exports.orderPostValidation = zod_1.z.object({
    restaurant: zod_1.z
        .string({ required_error: "Restaurant ID is required" })
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Restaurant ID" }),
    zone: zod_1.z
        .string({ required_error: "Table ID is required" })
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Table ID" }),
    menus: zod_1.z
        .array(zod_1.z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Each menu ID must be valid" }))
        .nonempty({ message: "At least one menu item is required" }),
    customerName: zod_1.z
        .string({ required_error: "Customer name is required" })
        .min(1, { message: "Customer name cannot be empty" }),
    customerPhone: zod_1.z
        .string({ required_error: "Customer phone is required" })
        .min(7, { message: "Customer phone must be at least 7 digits" }),
    orderType: orderTypeEnum,
    status: statusEnum.optional().default("pending"),
    specialRequest: zod_1.z.string().optional().default(""),
    total: zod_1.z.number({ required_error: "Total is required" }),
    isDeleted: zod_1.z.boolean().optional().default(false),
});
exports.orderUpdateValidation = exports.orderPostValidation.partial();
