"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productUpdateValidation = exports.productValidation = void 0;
const zod_1 = require("zod");
exports.productValidation = zod_1.z.object({
    productName: zod_1.z.string().min(1, "Product name is required"),
    skuCode: zod_1.z.string().min(1, "SKU code is required"),
    productCategory: zod_1.z.string().min(1, "Category is required"),
    productBrand: zod_1.z.string().min(1, "Brand is required"),
    productWeight: zod_1.z.string().nullable().optional(),
    productUnit: zod_1.z.string().min(1, "Unit is required"),
    productPurchasePoint: zod_1.z.string().nullable().optional(),
    productBuyingPrice: zod_1.z.number().min(0, "Buying price must be a positive number"),
    productSellingPrice: zod_1.z.number().min(0, "Selling price must be a positive number"),
    productOfferPrice: zod_1.z.number().nullable().optional(),
    productStock: zod_1.z.number().min(0, "Stock must be a positive number"),
    isFeatured: zod_1.z.boolean().default(false),
    haveVarient: zod_1.z.boolean().default(false),
    productDescription: zod_1.z.string().nullable().optional(),
    productFeatureImage: zod_1.z.string().nullable().optional(),
    productImages: zod_1.z.array(zod_1.z.string()).nullable().optional(),
    variant: zod_1.z.string().nullable().optional(),
    variantcolor: zod_1.z.array(zod_1.z.string()).nullable().optional(),
});
// ✅ Ensure null values are allowed in updates
exports.productUpdateValidation = exports.productValidation.deepPartial();
