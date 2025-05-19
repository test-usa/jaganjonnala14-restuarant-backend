"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = require("mongoose");
const OrderSchema = new mongoose_1.Schema({
    restaurant: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    zone: { type: mongoose_1.Schema.Types.ObjectId, ref: "RestaurantZone", default: "" },
    menus: [{ type: mongoose_1.Types.ObjectId, ref: "Menu", required: true }],
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    orderType: {
        type: String,
        enum: ["dine in", "takeaway"],
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "inProgress", "delivered", "cancel"],
        default: "pending",
    },
    specialRequest: { type: String, default: "" },
    total: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false
});
exports.OrderModel = (0, mongoose_1.model)("Order", OrderSchema);
