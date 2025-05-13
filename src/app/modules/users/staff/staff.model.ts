import mongoose, { Schema, model, Document, Types } from "mongoose";
import { IStaff } from "./staff.interface";


const StaffSchema = new Schema<IStaff>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: { type: Schema.Types.ObjectId,  ref: "Restaurant", required: true },
    workDay: { type: String, required: true }, // e.g., "Mon-Fri", or "Sunday"
    workTime: { type: String, required: true }, // e.g., "09:00 - 17:00"
    isDeleted: {
        type: Boolean,
        default: false
    }

  },
  {
    timestamps: true,
  }
);

export const StaffModel = model<IStaff>("Staff", StaffSchema);
