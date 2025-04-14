"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.productModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    productName: { type: String, required: true },
    skuCode: { type: String, required: true, unique: true },
    productCategory: { type: mongoose_1.Types.ObjectId, ref: "Category", required: true },
    productBrand: { type: mongoose_1.Types.ObjectId, ref: "Brand", required: true },
    productWeight: { type: String, default: "" }, // Default value set to an empty string
    productVariants: { type: mongoose_1.Types.ObjectId, ref: "Variants", required: true },
    productPurchasePoint: { type: String, default: "" }, // Default value set to an empty string
    productBuyingPrice: { type: Number, required: true, default: 0 }, // Default value set to 0
    productSellingPrice: { type: Number, required: true, default: 0 }, // Default value set to 0
    productOfferPrice: { type: Number, default: 0 }, // Default value set to 0
    productStock: { type: Number, required: true, default: 0 }, // Default value set to 0
    salesCount: { type: Number, default: 0 }, // For tracking best-sellers
    isFeatured: { type: Boolean, default: false },
    haveVarient: { type: Boolean, default: false },
    productDescription: { type: String, default: "" }, // Default value set to an empty string
    productFeatureImage: { type: String, default: null },
    productImages: [{ type: String, default: [] }], // Default value set to an empty array
    variant: { type: mongoose_1.Types.ObjectId, ref: "Attribute", default: null },
    variantcolor: { type: [{ type: mongoose_1.Types.ObjectId, ref: "AttributeOption" }], default: [] }, // Default value set to an empty array
    isDelete: { type: Boolean, default: false },
}, { timestamps: true });
exports.productModel = mongoose_1.default.model("product", productSchema);
