import mongoose from "mongoose";

const reportsSchema = new mongoose.Schema({}, { timestamps: true });

export const reportsModel = mongoose.model("reports", reportsSchema);