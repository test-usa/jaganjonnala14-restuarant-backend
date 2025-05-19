"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffUpdateValidation = exports.staffPostValidation = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const objectIdValidator = zod_1.z
    .string()
    .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
});
const statusEnum = zod_1.z.enum(["active", "inactive"]);
exports.staffPostValidation = zod_1.z.object({
    user: objectIdValidator,
    restaurant: objectIdValidator,
    workDay: zod_1.z.string().min(1, { message: "Work day is required" }),
    workTime: zod_1.z.string().min(1, { message: "Work time is required" }),
    status: statusEnum.optional(),
});
exports.staffUpdateValidation = exports.staffPostValidation.partial().optional();
