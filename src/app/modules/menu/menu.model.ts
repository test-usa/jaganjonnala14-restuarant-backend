import { Schema, model, Document, Types } from "mongoose";
import { IMenu } from "./menu.interface";


const MenuSchema = new Schema<IMenu>(
  {
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
    itemName: { type: String, required: true ,unique:true},
    image: {
      type: String,
      default: "",
    },
    price: { type: Number, required: true },
    size: {
      type: String,
      enum: ["small", "medium", "large"],
      required: true,
    },
    availability: { type: Boolean, default: true },
    description: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    like: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey:false
  }
);
MenuSchema.post("save", function (error: any, _doc: any, next: (arg0: Error) => void) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    if (error.keyPattern?.itemName) {
      return next(new Error("Item name must be unique"));
    }
  }
  next(error);
});

export const MenuModel = model<IMenu>("Menu", MenuSchema);
