import mongoose from "mongoose";
    
    const menuSchema = new mongoose.Schema({
    
     isDelete: {
            type: Boolean,
            default: false,
        }}, { timestamps: true });
    
    export const menuModel = mongoose.model("menu", menuSchema);