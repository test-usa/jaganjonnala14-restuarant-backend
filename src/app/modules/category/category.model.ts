import { Schema, model, Document } from "mongoose";
import { ICategory } from "./category.interface";

const CategorySchema = new Schema<ICategory>(
  {
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Post-save error handler for duplicate key
CategorySchema.post("save", function (error: any, _doc: any, next: (arg0: Error) => void) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    if (error.keyPattern?.categoryName) {
      return next(new Error("Category name must be unique"));
    }
  }
  next(error);
});

export const CategoryModel = model<ICategory>("Category", CategorySchema);
