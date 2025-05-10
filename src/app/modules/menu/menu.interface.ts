import mongoose from "mongoose";

export interface Imenu {
    itemName: string;
    category: mongoose.Types.ObjectId;
    restaurant: mongoose.Types.ObjectId;
    price: number;
    size: "small" | "large" | "medium";
    availability: boolean;
    image: string;
    like: number;
    rating: number;
    description: string;
    isDelete: boolean


}