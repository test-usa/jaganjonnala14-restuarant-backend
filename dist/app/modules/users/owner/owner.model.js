"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerModel = void 0;
const mongoose_1 = require("mongoose");
const OwnerSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Restaurant",
    },
    businessName: { type: String, required: true },
    businessEmail: { type: String, required: true },
    referralCode: { type: String },
    status: {
        type: String,
        enum: ["pending", "active", "rejected", "unverified"],
        default: "pending",
    },
    taxInfo: {
        gstRate: { type: String },
        cgstRate: { type: String },
        sgstRate: { type: String },
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.OwnerModel = (0, mongoose_1.model)("Owner", OwnerSchema);
