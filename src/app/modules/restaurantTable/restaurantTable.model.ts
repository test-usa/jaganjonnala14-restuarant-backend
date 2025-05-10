import mongoose from "mongoose";
    
    const restaurantTableSchema = new mongoose.Schema({
    
     isDelete: {
            type: Boolean,
            default: false,
        }}, { timestamps: true });
    
    export const restaurantTableModel = mongoose.model("restaurantTable", restaurantTableSchema);