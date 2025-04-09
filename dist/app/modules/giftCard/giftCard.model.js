"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.giftCardModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const giftCardSchema = new mongoose_1.default.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    remainingAmount: {
        type: Number,
        required: true,
        min: 0
    },
    allowMultipleUse: {
        type: Boolean,
        default: false // ডিফল্টভাবে একবার ব্যবহার করা যাবে
    },
    isActive: {
        type: Boolean,
        default: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    redeemedBy: [{
            user: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User'
            },
            amountUsed: Number,
            date: {
                type: Date,
                default: Date.now
            }
        }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });
// Index for faster querying
giftCardSchema.index({ code: 1, isActive: 1 });
exports.giftCardModel = mongoose_1.default.model('GiftCard', giftCardSchema);
