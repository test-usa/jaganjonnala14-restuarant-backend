import mongoose from "mongoose";
    
    const floorSchema = new mongoose.Schema({
    
     isDelete: {
            type: Boolean,
            default: false,
        }}, { timestamps: true });
    
    export const floorModel = mongoose.model("floor", floorSchema);