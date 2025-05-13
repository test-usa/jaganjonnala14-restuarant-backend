import mongoose from "mongoose";
    
    const restaurantZoneTypeSchema = new mongoose.Schema({
    
     isDelete: {
            type: Boolean,
            default: false,
        }}, { timestamps: true });
    
    export const restaurantZoneTypeModel = mongoose.model("restaurantZoneType", restaurantZoneTypeSchema);