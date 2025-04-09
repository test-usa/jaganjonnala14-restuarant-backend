"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// attributeOption.model.ts - attributeOption module
const mongoose_1 = __importDefault(require("mongoose"));
const AttributeOptionSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["color", "other"],
        required: true,
    },
    colorCode: {
        type: String,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    isDelete: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const AttributeOptionModel = mongoose_1.default.model("AttributeOption", AttributeOptionSchema);
exports.default = AttributeOptionModel;
