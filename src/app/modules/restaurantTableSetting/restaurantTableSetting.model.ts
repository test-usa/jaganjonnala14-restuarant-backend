import mongoose from "mongoose";
    
    const restaurantTableSettingSchema = new mongoose.Schema({
    
     isDelete: {
            type: Boolean,
            default: false,
        }}, { timestamps: true });
    
    export const restaurantTableSettingModel = mongoose.model("restaurantTableSetting", restaurantTableSettingSchema);