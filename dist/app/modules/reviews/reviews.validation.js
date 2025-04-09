"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewSchema = void 0;
// reviews.validation.ts - reviews module
const zod_1 = require("zod");
const mongodb_1 = require("mongodb");
// Review Validation Schema
exports.reviewSchema = zod_1.z.object({
    _id: zod_1.z.instanceof(mongodb_1.ObjectId),
    userId: zod_1.z.instanceof(mongodb_1.ObjectId), // Must be a valid user ID
    productId: zod_1.z.instanceof(mongodb_1.ObjectId), // Must be a valid product ID
    rating: zod_1.z.number()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must be at most 5"), // Rating should be between 1 and 5
    review: zod_1.z.string().min(5, "Review must be at least 5 characters long"), // Review must be meaningful
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
