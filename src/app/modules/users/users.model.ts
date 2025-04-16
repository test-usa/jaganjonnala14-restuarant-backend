import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true, default: undefined },
    password: { type: String },
    otp: {type: String},
    otpCreateAt: {type: new Date},
    isDelete: { type: Boolean, default: false},
    role: { type: String, enum: ["user", "admin"], default: "user" },
    name: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

export const usersModel = mongoose.model("user", usersSchema);
