import { Schema, model } from "mongoose";
import { IRestaurantZone } from "./restaurantZone.interface";

const RestaurantZoneSchema = new Schema<IRestaurantZone>(
  {
    table: { type: Schema.Types.ObjectId, ref: "Table", required: true },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    zoneName: { type: String, required: true }, // e.g. "Patio", "Main Hall"
    zoneType: { type: String, required: true }, // e.g. "Indoor", "Outdoor"
  },
  {
    timestamps: true,
  }
);

export const RestaurantZoneModel = model<IRestaurantZone>(
  "RestaurantZone",
  RestaurantZoneSchema
);
