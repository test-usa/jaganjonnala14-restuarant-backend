"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersUpdateValidation = exports.userInputSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const objectIdValidator = zod_1.z
    .string()
    .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
});
const roleEnum = zod_1.z.enum([
    "admin",
    "restaurant_owner",
    "staff",
    "customer",
    "manager",
    "dine in",
    "waiter",
    "chief",
    "cashier",
    "maintenance",
]);
exports.userInputSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    email: zod_1.z.string().email({ message: "Invalid email address" }),
    phone: zod_1.z.string().min(7, { message: "Phone number is required" }),
    password: zod_1.z.string().min(6, { message: "Password must be at least 6 characters" }),
    role: roleEnum,
    image: zod_1.z.string().url({ message: "Invalid image URL" }).optional(),
    providerId: zod_1.z.string().optional().nullable(),
    provider: zod_1.z.string().optional().nullable(),
    otp: zod_1.z.string().optional().nullable(),
    otpExpiresAt: zod_1.z.string().datetime().optional().nullable(),
});
exports.usersUpdateValidation = exports.userInputSchema.partial();
