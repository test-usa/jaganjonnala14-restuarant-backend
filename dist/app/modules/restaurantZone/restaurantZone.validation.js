"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantZoneUpdateValidation = exports.restaurantZoneValidationSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
exports.restaurantZoneValidationSchema = zod_1.z.object({
    restaurant: zod_1.z
        .string()
        .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
        message: "Invalid restaurant ID",
    }),
    tableName: zod_1.z.string().min(1, "Table name is required"),
    tableSetting: zod_1.z.string().min(1, "Table setting is required"),
    seatingCapacity: zod_1.z
        .number({ required_error: "Seating capacity is required" })
        .int("Seating capacity must be an integer")
        .min(1, "Seating capacity must be at least 1"),
    isDeleted: zod_1.z.boolean().optional(),
    zoneName: zod_1.z.string().min(1, "Zone name is required"),
    zoneType: zod_1.z.string().min(1, "Zone type is required"),
});
exports.restaurantZoneUpdateValidation = exports.restaurantZoneValidationSchema.partial();
