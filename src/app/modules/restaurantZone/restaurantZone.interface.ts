import mongoose, { Types } from "mongoose";

export interface IRestaurantZone {
  Table: Types.ObjectId;
  restaurant: Types.ObjectId;
  ZoneName: string;
  ZoneType: string;
}
