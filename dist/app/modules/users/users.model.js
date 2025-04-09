"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const usersSchema = new mongoose_1.default.Schema({
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true, default: undefined },
    password: { type: String },
    isDelete: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    name: { type: String },
    address: { type: String },
}, { timestamps: true });
exports.usersModel = mongoose_1.default.model("user", usersSchema);
