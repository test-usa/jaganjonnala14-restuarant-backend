import mongoose from "mongoose";
    
    const ordersSchema = new mongoose.Schema({
    
     isDelete: {
            type: Boolean,
            default: false,
        }}, { timestamps: true });
    
    export const ordersModel = mongoose.model("orders", ordersSchema);