import mongoose, { Schema } from "mongoose";
import { IUser } from "./users.interface";

const RoleEnum = [
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
];

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String },
    providerId: { type: String },
    provider: { type: String },
    phone: { type: String },
    password: { type: String },
    image: { type: String, nullable: true },
    role: {
      type: String,
      enum: RoleEnum,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

export const userModel = mongoose.model<IUser>("User", UserSchema);
