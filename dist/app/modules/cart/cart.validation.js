"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartUpdateValidation = exports.cartSchemaValidation = void 0;
const zod_1 = require("zod");
// Cart Validation Schema
exports.cartSchemaValidation = zod_1.z.object({
    product: zod_1.z.string(),
    quantity: zod_1.z.number().min(1, { message: "Quantity must be at least 1" }),
    variant: zod_1.z.string().optional(), // Validate the Variant data
    price: zod_1.z.number().min(0, { message: "Price cannot be less than 0" }),
});
exports.cartUpdateValidation = exports.cartSchemaValidation.partial();
