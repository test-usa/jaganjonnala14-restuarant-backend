import mongoose from "mongoose";
import { Icategories } from "./categories.interface";

const categoriesSchema = new mongoose.Schema<Icategories>(
  {
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
    },
    image: {
        type: String,
        default: null,
        
    },
    description: {
        type: String
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
        default: null,

    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const categoriesModel = mongoose.model<Icategories>(
  "categories",
  categoriesSchema
);
