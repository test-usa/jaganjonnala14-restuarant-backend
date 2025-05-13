import mongoose, { Schema, model, Document, Types } from "mongoose";
import { IOwner } from "./owner.interface";


const OwnerSchema = new Schema<IOwner>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
    businessName: { type: String, required: true },
    businessEmail: { type: String, required: true },
    referralCode: { type: String, required: true },
    taxInfo: {
      gstRate: { type: String, required: true },
      cgstRate: { type: String, required: true },
      sgstRate: { type: String, required: true },
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
  },
  {
    timestamps: true,
  }
);

export const OwnerModel = model<IOwner>("Owner", OwnerSchema);
