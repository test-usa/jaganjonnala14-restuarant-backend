import mongoose from "mongoose";
import { Ibrand } from "./brand.interface";

const brandSchema = new mongoose.Schema<Ibrand>(
  {
    brandName: {
      type: String,
      required: true,
    },
    brandImage: {
      type: String ,
      required: true,
    },
    brandDescription: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // soft delete
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const brandModel = mongoose.model<Ibrand>("brand", brandSchema);
