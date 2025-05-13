import { Schema, model, Document, Types } from "mongoose";
import { IFloor } from "./floor.interface";


const FloorSchema = new Schema<IFloor>(
  {
    restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
    floorName: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

export const FloorModel = model<IFloor>("Floor", FloorSchema);
