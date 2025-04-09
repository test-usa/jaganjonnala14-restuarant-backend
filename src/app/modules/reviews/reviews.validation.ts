// reviews.validation.ts - reviews module
import { z } from "zod";
import { ObjectId } from "mongodb";

// Review Validation Schema
export const reviewSchema = z.object({
  _id: z.instanceof(ObjectId),
  userId: z.instanceof(ObjectId), // Must be a valid user ID
  productId: z.instanceof(ObjectId), // Must be a valid product ID
  rating: z.number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"), // Rating should be between 1 and 5
  review: z.string().min(5, "Review must be at least 5 characters long"), // Review must be meaningful
  createdAt: z.date(),
  updatedAt: z.date(),
});
