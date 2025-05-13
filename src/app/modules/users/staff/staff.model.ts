import mongoose from "mongoose";
    
    const staffSchema = new mongoose.Schema({
    
     isDelete: {
            type: Boolean,
            default: false,
        }}, { timestamps: true });
    
    export const staffModel = mongoose.model("staff", staffSchema);