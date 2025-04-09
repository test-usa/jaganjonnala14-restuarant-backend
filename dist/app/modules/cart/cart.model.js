"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cartSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1,
            },
            variant: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "AttributeOption",
            },
            price: {
                type: Number,
                required: true,
            },
            totalPrice: {
                type: Number,
                required: true,
            },
        },
    ],
    cartTotalCost: {
        type: Number,
        required: true,
        default: 0,
    },
    isDelete: {
        type: Boolean,
        default: false,
    },
    // Flag to indicate whether the cart is ready for checkout or not. Default is false.
    isCheckout: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
// Auto-update cart total before saving
exports.cartModel = mongoose_1.default.model("cart", cartSchema);
