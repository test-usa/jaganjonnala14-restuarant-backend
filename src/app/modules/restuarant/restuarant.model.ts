import mongoose from "mongoose";
import { IRestuarant } from "./restuarant.interface";

const restuarantSchema = new mongoose.Schema<IRestuarant>(
  {
    name: { type: String, required: true },
    businessName: { type: String, required: true },
    businessEmail: { type: String, required: true },
    phone: { type: String, required: true },
    gstRate: { type: String, required: true },
    cgstRate: { type: String, required: true },
    sgstRate: { type: String, required: true },
    address: { type: String, required: true },
    logo: { type: String, default: null }, // nullable/optional
    tagline: { type: String, required: true },
    coverPhoto: [{ type: String }], // Array of image URLs
    description: { type: String, required: true },
    referralCode: { type: String, required: true },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const restuarantModel = mongoose.model<IRestuarant>("restuarant", restuarantSchema);
