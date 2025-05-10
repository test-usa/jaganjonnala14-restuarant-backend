import mongoose from "mongoose";

export interface Icategory {
    title: string;
    restaurant: mongoose.Types.ObjectId
    isDelete: boolean
}