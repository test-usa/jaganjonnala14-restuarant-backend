import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({}, { timestamps: true });

export const incomeModel = mongoose.model("income", incomeSchema);