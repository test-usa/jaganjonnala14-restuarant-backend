import mongoose from "mongoose";

const unitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const unitModel = mongoose.model("Unit", unitSchema);