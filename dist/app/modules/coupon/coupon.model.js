"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const couponSchema = new mongoose_1.default.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    description: String,
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0
    },
    minOrderAmount: {
        type: Number,
        default: 0
    },
    maxDiscountAmount: {
        type: Number,
        default: null
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usageLimit: {
        type: Number,
        default: null
    },
    usedCount: {
        type: Number,
        default: 0
    },
    isDelete: {
        type: Boolean,
        default: false,
    },
    usersUsed: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User'
        }],
    categories: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Category'
        }],
    products: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Product'
        }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });
// Index for faster querying
couponSchema.index({ code: 1, isActive: 1 });
exports.couponModel = mongoose_1.default.model('Coupon', couponSchema);
