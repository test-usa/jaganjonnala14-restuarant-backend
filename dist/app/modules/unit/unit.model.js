"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unitModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const unitSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });
exports.unitModel = mongoose_1.default.model("Variants", unitSchema);
