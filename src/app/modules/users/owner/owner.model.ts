import mongoose from "mongoose";
    
    const ownerSchema = new mongoose.Schema({
    
     isDelete: {
            type: Boolean,
            default: false,
        }}, { timestamps: true });
    
    export const ownerModel = mongoose.model("owner", ownerSchema);