"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const wishlistSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "user", required: true },
    products: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "product" }],
    isDelete: { type: Boolean, default: false },
}, { timestamps: true });
exports.wishlistModel = mongoose_1.default.model("wishlist", wishlistSchema);
