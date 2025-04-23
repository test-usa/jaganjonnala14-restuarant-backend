import mongoose from "mongoose";
    
    const customerSchema = new mongoose.Schema({
    
     isDelete: {
            type: Boolean,
            default: false,
        }}, { timestamps: true });
    
    export const customerModel = mongoose.model("customer", customerSchema);