"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.floorUpdateValidation = exports.floorPostValidation = void 0;
const zod_1 = require("zod");
exports.floorPostValidation = zod_1.z.object({
    restaurant: zod_1.z
        .string({ required_error: "Restaurant ID is required" })
        .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Restaurant ID" }),
    floorName: zod_1.z.string().min(1, { message: "Floor name is required" }),
    isDeleted: zod_1.z.boolean().optional().default(false),
});
exports.floorUpdateValidation = exports.floorPostValidation.partial();
