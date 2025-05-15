import { Schema, model } from "mongoose";
import { IRestaurantZone } from "./restaurantZone.interface";


const RestaurantZoneSchema = new Schema<IRestaurantZone>(
  {
    restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
    tableName: { type: String, required: true ,unique: true },
    tableSetting: { type: String, required: true },
    seatingCapacity: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    zoneName: { type: String, required: true },
    zoneType: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
RestaurantZoneSchema.post("save", function (error: any, _doc: any, next: (err: Error) => void) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    if (error.keyPattern?.tableName) {
      return next(new Error("Table name must be unique"));
    }
  }
  next(error);
});

export const RestaurantZone= model<IRestaurantZone>(
  "RestaurantZone",
  RestaurantZoneSchema
);
