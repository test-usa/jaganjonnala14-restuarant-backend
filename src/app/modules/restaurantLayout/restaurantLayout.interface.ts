import mongoose from "mongoose";

export interface IrestaurantLayout {
  zoneName: string;
  zoneType: mongoose.Types.ObjectId;
  tableName: mongoose.Types.ObjectId;
  tableSetting: mongoose.Types.ObjectId;
  seatingCapacity: number;
}
