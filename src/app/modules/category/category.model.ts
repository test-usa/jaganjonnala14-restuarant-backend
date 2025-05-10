import mongoose from "mongoose";
    
    const categorySchema = new mongoose.Schema({
    
     isDelete: {
            type: Boolean,
            default: false,
        }}, { timestamps: true });
    
    export const categoryModel = mongoose.model("category", categorySchema);