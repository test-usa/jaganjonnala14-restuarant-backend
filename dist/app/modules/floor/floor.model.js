"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloorModel = void 0;
const mongoose_1 = require("mongoose");
const FloorSchema = new mongoose_1.Schema({
    restaurant: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    floorName: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false,
});
FloorSchema.index({ restaurant: 1, floorName: 1 }, { unique: true });
exports.FloorModel = (0, mongoose_1.model)("Floor", FloorSchema);
