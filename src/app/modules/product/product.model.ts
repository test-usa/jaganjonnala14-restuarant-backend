import mongoose, { Types } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    skuCode: { type: String, required: true, unique: true },
    productCategory: { type: Types.ObjectId, ref: "Category", required: true },
    productBrand: { type: Types.ObjectId, ref: "Brand", required: true },
    productWeight: { type: String, default: "" }, // Default value set to an empty string
    productUnit: { type: Types.ObjectId, ref: "Unit", required: true },
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
    variant: { type: Types.ObjectId, ref: "Attribute", default: null },
    variantcolor: { type: [{ type: Types.ObjectId, ref: "AttributeOption" }], default: [] }, // Default value set to an empty array
    isDelete: { type: Boolean, default: false },
  
  },
  { timestamps: true }
);

export const productModel = mongoose.model("product", productSchema);
