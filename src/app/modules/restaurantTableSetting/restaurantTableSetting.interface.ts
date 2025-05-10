import mongoose from "mongoose";

export interface IrestaurantTableSetting {
  title: string;
  restaurant: mongoose.Types.ObjectId;
}
