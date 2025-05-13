import { Types } from "mongoose";

export interface IRestaurantLayout {
  floor: Types.ObjectId;
  restaurant: Types.ObjectId;
  NumberOfTables: Number;
  capacity: Number;
}
