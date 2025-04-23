import mongoose from "mongoose";
import { Iusers } from "./users.interface";

const usersSchema = new mongoose.Schema<Iusers>(
  {
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "vendor", "customer"],
      default: "customer",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const usersModel = mongoose.model<Iusers>("users", usersSchema);
