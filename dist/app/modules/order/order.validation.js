"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderValidationSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
exports.orderValidationSchema = zod_1.z.object({
    customer: zod_1.z.object({
        name: zod_1.z.string().min(1, "Customer name is required"),
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().min(1, "Phone number is required"),
        address: zod_1.z.string().min(1, "Address is required"),
    }),
    payment: zod_1.z.object({
        type: zod_1.z.enum(["manual", "cashOnDelivery", "SSLCommerz"]),
        method: zod_1.z.enum(["bkash", "nagad", "upay", "rocket"]).nullable().optional(),
        transactionId: zod_1.z.string().optional(),
        status: zod_1.z.enum(["pending", "initiated", "paid", "failed"]).default("pending"),
    }),
    delivery: zod_1.z.object({
        location: zod_1.z.enum(["inside", "outside"]),
        fee: zod_1.z.number().min(0, "Delivery fee is required"),
    }),
    coupon: zod_1.z
        .object({
        code: zod_1.z.string().optional(),
        discount: zod_1.z.number().min(0).optional(),
    })
        .nullable()
        .optional(),
    items: zod_1.z.array(zod_1.z.object({
        product: zod_1.z.custom((val) => mongoose_1.default.Types.ObjectId.isValid(val), { message: "Invalid product ID" }),
        quantity: zod_1.z.number().min(1, "Quantity must be at least 1"),
        price: zod_1.z.number().min(0, "Price must be at least 0"),
    })),
    subtotal: zod_1.z.number().min(0, "Subtotal is required"),
    total: zod_1.z.number().min(0, "Total is required"),
    status: zod_1.z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending"),
});
