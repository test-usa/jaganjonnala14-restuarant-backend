import mongoose from "mongoose";
import { Iusers } from "./users.interface";
import bcrypt from "bcryptjs";

const usersSchema = new mongoose.Schema<Iusers>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        validator: function (value: string) {
          return /^(?:\+8801|8801|01)[3-9]\d{8}$/.test(value);
        },
        message: (props) =>
          `${props.value} is not a valid Bangladeshi phone number!`,
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    image: { type: String },
    address: { type: String, trim: true },
    role: {
      type: String,
      enum: ["admin", "employee", "customer"],
      default: "customer",
    },
    rewardPoints: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    isDelete: { type: Boolean, default: false },
  },
  { timestamps: true }
);


export const usersModel = mongoose.model<Iusers>("users", usersSchema);
