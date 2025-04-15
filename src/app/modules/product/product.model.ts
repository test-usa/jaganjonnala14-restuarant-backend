import mongoose, { Types } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    skuCode: { type: String, required: true, unique: true },
    productCategory: { type: Types.ObjectId, ref: "Category", required: true },
    productBrand: { type: Types.ObjectId, ref: "Brand", required: true },
    productVariants: [{ type: Types.ObjectId, ref: "variants"}],
    productBuyingPrice: { type: Number, required: true, default: 0 }, 
    productSellingPrice: { type: Number, required: true, default: 0 }, 
    productOfferPrice: { type: Number, default: 0 }, 
    productStock: { type: Number, required: true, default: 0 }, 
    salesCount: { type: Number, default: 0 }, 
    isFeatured: { type: Boolean, default: false },
    productDescription: { type: String, default: "" }, 
    productFeatureImage: { type: String, default: null },
    productImages: [{ type: String, default: [] }], 
    isDelete: { type: Boolean, default: false },
  
  },
  { timestamps: true }
);

export const productModel = mongoose.model("product", productSchema);
