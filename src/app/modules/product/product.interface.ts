import { Types } from "mongoose";

export interface IProduct {
  _id?: Types.ObjectId;
  productName: string;
  skuCode: string;
  productCategory: Types.ObjectId;
  productBrand: Types.ObjectId;
  productVariants?: Types.ObjectId[];
  productBuyingPrice: number;
  productSellingPrice: number;
  productOfferPrice?: number;
  productStock: number;
  salesCount?: number;
  isFeatured?: boolean;
  productDescription?: string;
  productFeatureImage?: string | null;
  productImages?: string[];
  isDelete?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
