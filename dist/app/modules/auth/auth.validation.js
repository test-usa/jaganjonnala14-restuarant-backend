"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLoginValidation = exports.restaurantValidationRequest = void 0;
const zod_1 = require("zod");
exports.restaurantValidationRequest = zod_1.z.object({
    restaurantName: zod_1.z.string(),
    businessName: zod_1.z.string(),
    businessEmail: zod_1.z.string(),
    phone: zod_1.z.string(),
    restaurantAddress: zod_1.z.string(),
    password: zod_1.z.string(),
    referralCode: zod_1.z.string().optional()
});
exports.authLoginValidation = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
