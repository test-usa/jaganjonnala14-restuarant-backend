"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandModel = void 0;
// brand.model.ts - brand module
const mongoose_1 = require("mongoose");
const BrandSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    isFeatured: { type: String, default: "false" },
    image: { type: String, required: true }, // Array of image URLs
    status: { type: String, enum: ["active", "Inactive"], default: "active" },
    isDelete: { type: Boolean, default: false },
}, { timestamps: true });
exports.BrandModel = (0, mongoose_1.model)("Brand", BrandSchema);
