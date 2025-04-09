"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAttributeOptionValidationSchema = exports.AttributeOptionValidationSchema = void 0;
// attributeOption.validation.ts - attributeOption module
const zod_1 = require("zod");
exports.AttributeOptionValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    type: zod_1.z.enum(["color", "other"]),
    colorCode: zod_1.z.string().nullable().optional(), // Allow null and undefined
    status: zod_1.z.string()
});
exports.updateAttributeOptionValidationSchema = exports.AttributeOptionValidationSchema.partial();
