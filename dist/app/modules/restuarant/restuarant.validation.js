"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restuarantUpdateValidation = exports.restuarantPostValidation = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
// Helper to validate MongoDB ObjectId strings
const objectId = zod_1.z.string().refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
});
exports.restuarantPostValidation = zod_1.z.object({
    owner: objectId.optional(), // Optional as per your Mongoose schema
    restaurantName: zod_1.z.string().min(1, "Restaurant name is required"),
    restaurantAddress: zod_1.z.string().min(1, "Restaurant address is required"),
    phone: zod_1.z.string().min(1, "Phone number is required"),
    status: zod_1.z.enum(["active", "pending", "cancelled"]).optional(),
    logo: zod_1.z.string().optional().nullable(),
    tagline: zod_1.z.string().optional(),
    coverPhoto: zod_1.z.string().optional(),
    images: zod_1.z.array(zod_1.z.string()).optional().default([]),
    description: zod_1.z.string().optional(),
    menus: zod_1.z.array(objectId).optional().default([]),
    isDeleted: zod_1.z.boolean().optional(),
});
exports.restuarantUpdateValidation = exports.restuarantPostValidation.partial();
