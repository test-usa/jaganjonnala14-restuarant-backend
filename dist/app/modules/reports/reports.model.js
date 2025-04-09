"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportsModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const reportsSchema = new mongoose_1.default.Schema({}, { timestamps: true });
exports.reportsModel = mongoose_1.default.model("reports", reportsSchema);
