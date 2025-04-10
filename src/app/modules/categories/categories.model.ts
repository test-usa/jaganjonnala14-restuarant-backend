// categories.model.ts - categories module
import mongoose, { Schema } from "mongoose";
import { ICategory } from "./categories.interface";

// Category Schema definition
const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["parent", "category", "subcategory"],
      required: true,
    },

    // Reference to Parent Category (Only for "category" or "subcategory")
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    category: { type: Schema.Types.ObjectId, ref: "Category", default: null },

    // Categories under a Parent Category (Only for "parent")
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    image: { type: String, default: null },
    // Subcategories under a Category (Only for "category")
    subcategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],

    description: { type: String, trim: true },

    status: { type: String, enum: ["active", "inactive"], default: "active" },

    isDelete: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Category Model
const categoryModel = mongoose.model<ICategory>("Category", categorySchema);

export default categoryModel;
