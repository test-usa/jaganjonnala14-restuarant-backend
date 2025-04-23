import mongoose from "mongoose";
    
    const managerSchema = new mongoose.Schema({
    
     isDelete: {
            type: Boolean,
            default: false,
        }}, { timestamps: true });
    
    export const managerModel = mongoose.model("manager", managerSchema);