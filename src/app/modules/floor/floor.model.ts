import { Schema, model, Document, Types } from "mongoose";
import { IFloor } from "./floor.interface";


const FloorSchema = new Schema<IFloor>(
  {
    restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
    floorName: { type: String, required: true,unique: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, 
    versionKey:false
  }
);

FloorSchema.post("save", function (error: any, _doc: any, next: (arg0: Error) => void) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    if (error.keyPattern?.floorName) {
      return next(new Error("Floor name must be unique"));
    }
  }
  next(error);
});


export const FloorModel = model<IFloor>("Floor", FloorSchema);
