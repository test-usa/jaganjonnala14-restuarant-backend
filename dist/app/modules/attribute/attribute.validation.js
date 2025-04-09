"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeValidationPutSchema = exports.AttributeValidationPostSchema = void 0;
// attribute.validation.ts - attribute module
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
exports.AttributeValidationPostSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    attributeOption: zod_1.z
        .array(zod_1.z.string().refine((id) => mongoose_1.Types.ObjectId.isValid(id), "Invalid ObjectId"))
        .min(1, "At least one attribute option is required").optional(),
    isDelete: zod_1.z.boolean().optional(), // Optional since default is `false`
});
exports.AttributeValidationPutSchema = exports.AttributeValidationPostSchema.partial();
