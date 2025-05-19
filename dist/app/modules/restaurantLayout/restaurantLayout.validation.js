"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantLayoutUpdateValidation = exports.restaurantLayoutPostValidation = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
exports.restaurantLayoutPostValidation = zod_1.z.object({
    floor: zod_1.z
        .string()
        .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
        message: "Invalid floor ID",
    }),
    restaurant: zod_1.z
        .string()
        .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
        message: "Invalid restaurant ID",
    }),
    numberOfTables: zod_1.z
        .number({ required_error: "Number of tables is required" })
        .int("Number of tables must be an integer")
        .min(1, "Number of tables must be at least 1"),
    isDeleted: zod_1.z.boolean().optional(),
});
exports.restaurantLayoutUpdateValidation = exports.restaurantLayoutPostValidation.partial();
