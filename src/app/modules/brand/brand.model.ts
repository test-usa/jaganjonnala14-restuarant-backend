// brand.model.ts - brand module
import  { Schema, model } from "mongoose";
import { IBrand } from "./brand.interface";

const BrandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, trim: true },
    isFeatured: { type: String, default : "false" },
    image: { type: String, required: true }, // Array of image URLs
    status: { type: String, enum: ["active", "Inactive"], default: "active" },
    isDelete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BrandModel = model<IBrand>("Brand", BrandSchema);
