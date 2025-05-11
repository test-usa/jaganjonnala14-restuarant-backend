import mongoose, { Schema } from "mongoose";
import { Iusers } from "./users.interface";

const UserSchema = new Schema<Iusers>(
  {
    user: {
      name: { type: String },
      email: { type: String },
      fullName: { type: String },
      providerId: { type: String },
      provider: { type: String },
      nickName: { type: String },
      gender: { type: String, enum: ["male", "female"] },
      country: { type: String },
      language: { type: String },
      timeZone: { type: String },
      phone: { type: String },
      password: { type: String },
      image: { type: String, nullable : true },
      address: { type: String },
      role: {
        type: String,
        enum: [
          "admin",
          "restaurant_owner",
          "staff",
          "customer",
          "manager",
          "dine in",
          "waiter",
          "chief",
          "cashier",
          "maintenance",
        ],
      },
    },
    restaurant: {
      name: { type: String },
      businessName: { type: String },
      businessEmail: { type: String },
      phone: { type: String },
      gstRate: { type: String },
      cgstRate: { type: String },
      sgstRate: { type: String },
      address: { type: String },
      logo: { type: String, nullable: true },
      tagline: { type: String },
      coverPhoto: [{ type: String }],
      description: { type: String },
      referralCode: { type: String },
    },
    staff: {
      workDays: { type: String },
      workTime: { type: String },
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      required: true,
    },
    lastLogin: { type: Date },
    isDelete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const usersModel = mongoose.model<Iusers>("users", UserSchema);
