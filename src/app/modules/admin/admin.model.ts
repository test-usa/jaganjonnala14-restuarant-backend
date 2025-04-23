import mongoose from "mongoose";
    
    const adminSchema = new mongoose.Schema({
    
     isDelete: {
            type: Boolean,
            default: false,
        }}, { timestamps: true });
    
    export const adminModel = mongoose.model("admin", adminSchema);