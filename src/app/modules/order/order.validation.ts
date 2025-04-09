import { z } from "zod";
import mongoose from "mongoose";

export const orderValidationSchema = z.object({
    customer: z.object({
        name: z.string().min(1, "Customer name is required"),
        email: z.string().email().optional(),
        phone: z.string().min(1, "Phone number is required"),
        address: z.string().min(1, "Address is required"),
    }),
    payment: z.object({
        type: z.enum(["manual", "cashOnDelivery", "SSLCommerz"]),
        method: z.enum(["bkash", "nagad", "upay", "rocket"]).nullable().optional(),
        transactionId: z.string().optional(),
        status: z.enum(["pending", "initiated", "paid", "failed"]).default("pending"),
    }),
    delivery: z.object({
        location: z.enum(["inside", "outside"]),
        fee: z.number().min(0, "Delivery fee is required"),
    }),
    coupon: z
        .object({
            code: z.string().optional(),
            discount: z.number().min(0).optional(),
        })
        .nullable()
        .optional(),
    items: z.array(
        z.object({
            product: z.custom<mongoose.Types.ObjectId>(
                (val) => mongoose.Types.ObjectId.isValid(val as string),
                { message: "Invalid product ID" }
            ),
            quantity: z.number().min(1, "Quantity must be at least 1"),
            price: z.number().min(0, "Price must be at least 0"),
        })
    ),
    subtotal: z.number().min(0, "Subtotal is required"),
    total: z.number().min(0, "Total is required"),
    status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending"),
});


