import mongoose from "mongoose";
    
    const orderSchema = new mongoose.Schema({
    
     isDelete: {
            type: Boolean,
            default: false,
        }}, { timestamps: true });
    
    export const orderModel = mongoose.model("order", orderSchema);