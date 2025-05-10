import mongoose from "mongoose";

export interface IrestaurantTable {
  title: string;
  restaurant: mongoose.Types.ObjectId;
}
