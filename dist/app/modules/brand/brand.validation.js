"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandValidationPut = exports.BrandValidation = void 0;
// brand.validation.ts - brand module
const zod_1 = require("zod");
exports.BrandValidation = zod_1.z.object({
    name: zod_1.z.string().min(1, "Brand name is required"),
    isFeatured: zod_1.z.string(),
    status: zod_1.z.enum(["active", "Inactive"]).default("active"),
    isDelete: zod_1.z.boolean().default(false),
});
exports.BrandValidationPut = exports.BrandValidation.partial();
