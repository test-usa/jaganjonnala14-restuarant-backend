import mongoose from "mongoose";

const balanceSchema = new mongoose.Schema({}, { timestamps: true });

export const balanceModel = mongoose.model("balance", balanceSchema);