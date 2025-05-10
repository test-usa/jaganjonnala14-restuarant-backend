import mongoose from "mongoose";
    
    const restaurantLayoutSchema = new mongoose.Schema({
    
     isDelete: {
            type: Boolean,
            default: false,
        }}, { timestamps: true });
    
    export const restaurantLayoutModel = mongoose.model("restaurantLayout", restaurantLayoutSchema);