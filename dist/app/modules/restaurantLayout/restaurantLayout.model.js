"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantLayoutModel = void 0;
const mongoose_1 = require("mongoose");
const RestaurantLayoutSchema = new mongoose_1.Schema({
    floor: { type: mongoose_1.Schema.Types.ObjectId, ref: "Floor", required: true },
    restaurant: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    numberOfTables: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false
});
exports.RestaurantLayoutModel = (0, mongoose_1.model)("RestaurantLayout", RestaurantLayoutSchema);
