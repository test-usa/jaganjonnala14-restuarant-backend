"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantZone = void 0;
const mongoose_1 = require("mongoose");
const RestaurantZoneSchema = new mongoose_1.Schema({
    restaurant: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    tableName: { type: String, required: true },
    tableSetting: { type: String, required: true },
    seatingCapacity: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    zoneName: { type: String, required: true },
    zoneType: { type: String, required: true },
}, {
    timestamps: true,
    versionKey: false,
});
RestaurantZoneSchema.index({ restaurant: 1, tableName: 1 }, { unique: true });
exports.RestaurantZone = (0, mongoose_1.model)("RestaurantZone", RestaurantZoneSchema);
