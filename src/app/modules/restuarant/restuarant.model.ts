import mongoose, { Schema, model, Document, Types } from "mongoose";
import { IRestaurant } from "./restuarant.interface";


const RestaurantSchema = new Schema<IRestaurant>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "Owner", required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    logo: { type: String, default: null },
    tagline: { type: String, required: true },
    coverPhoto: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const RestaurantModel = model<IRestaurant>(
  "Restaurant",
  RestaurantSchema
);
