import { Types } from "mongoose";

export interface IRestaurantZone {
  table: Types.ObjectId;
  restaurant: Types.ObjectId;
  zoneName: string;
  zoneType: string;
  isDeleted: boolean;
}
