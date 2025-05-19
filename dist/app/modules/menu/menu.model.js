"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuModel = void 0;
const mongoose_1 = require("mongoose");
const MenuSchema = new mongoose_1.Schema({
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: "Category", required: true },
    restaurant: { type: mongoose_1.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    itemName: { type: String, required: true },
    image: {
        type: String,
        default: "",
    },
    price: { type: Number, required: true },
    size: {
        type: String,
        enum: ["small", "medium", "large"],
        required: true,
    },
    availability: { type: Boolean, default: true },
    description: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    like: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false
});
MenuSchema.index({ restaurant: 1, itemName: 1 }, { unique: true });
exports.MenuModel = (0, mongoose_1.model)("Menu", MenuSchema);
