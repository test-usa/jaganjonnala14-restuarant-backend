"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistUpdateValidation = exports.wishlistValidation = void 0;
const zod_1 = require("zod");
exports.wishlistValidation = zod_1.z.object({
    products: zod_1.z.array(zod_1.z.string().min(1, "Product ID is required")),
});
exports.wishlistUpdateValidation = exports.wishlistValidation.partial();
