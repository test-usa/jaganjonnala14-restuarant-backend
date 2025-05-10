import mongoose from "mongoose";

export interface Iorder {
    orderId: string;
    status: "pending" | "inProgress" | "delivered" | "cancel";
    customerName: string;
    customerPhone: string;
    orderType: "dine in" | "takeaway";
    restaurantTable: mongoose.Types.ObjectId;
    menus: mongoose.Types.ObjectId[];
    specialRequest: string;


}