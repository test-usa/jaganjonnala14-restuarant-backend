import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({}, { timestamps: true });

export const expenseModel = mongoose.model("expense", expenseSchema);