"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableUpdateValidation = exports.tablePostValidation = void 0;
const zod_1 = require("zod");
// MongoDB ObjectId regex
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
exports.tablePostValidation = zod_1.z.object({
    restaurant: zod_1.z
        .string({ required_error: "Restaurant ID is required" })
        .regex(objectIdRegex, { message: "Invalid Restaurant ID format" }),
    tableName: zod_1.z
        .string({ required_error: "Table name is required" })
        .min(1, { message: "Table name cannot be empty" }),
    tableSetting: zod_1.z
        .string({ required_error: "Table setting is required" })
        .min(1, { message: "Table setting cannot be empty" }),
    seatingCapacity: zod_1.z
        .number({ required_error: "Seating capacity is required" })
        .int({ message: "Seating capacity must be an integer" })
        .positive({ message: "Seating capacity must be greater than 0" }),
    isDeleted: zod_1.z.boolean().optional().default(false),
});
exports.tableUpdateValidation = exports.tablePostValidation.partial();
