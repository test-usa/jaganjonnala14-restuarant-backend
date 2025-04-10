import { ObjectId } from "mongoose";

// Category Interface
export interface ICategory {
  name: string;
  type: "parent" | "category" | "subcategory";
  parentCategory?: ObjectId | null;
  category?: ObjectId | null;
  categories?: ObjectId[]; 
  subcategories?: ObjectId[];
  image?: string;
  description?: string;
  status: "active" | "inactive"
  isDelete: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
