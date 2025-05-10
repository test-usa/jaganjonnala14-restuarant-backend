import mongoose from "mongoose";

export interface IrestaurantZoneType {
  title: string;
  restaurant: mongoose.Types.ObjectId;
}
