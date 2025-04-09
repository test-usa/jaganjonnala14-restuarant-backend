// reviews.interface.ts - reviews module
import { ObjectId } from "mongodb";

// Review Interface
export interface IReview {
  _id: ObjectId;
  userId: ObjectId; // References the Users collection
  productId: ObjectId; // References the Products collection
  rating: number; // Rating between 1-5
  review: string; // Review text
  createdAt: Date;
  updatedAt: Date;
}
