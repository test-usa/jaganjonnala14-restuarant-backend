import mongoose from "mongoose";
    
    const tableSchema = new mongoose.Schema({
    
     isDelete: {
            type: Boolean,
            default: false,
        }}, { timestamps: true });
    
    export const tableModel = mongoose.model("table", tableSchema);