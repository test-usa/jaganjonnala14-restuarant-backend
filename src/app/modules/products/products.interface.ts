import { Types } from "mongoose";

export interface IProduct {
  _id?: Types.ObjectId;
  name: string;
  slug?: string;
  description?: string;

  brand?: Types.ObjectId;
  category: Types.ObjectId;
  subcategories?: Types.ObjectId[];
  vendor: Types.ObjectId;

  price: number;
  discount?: number;
  stock?: number;
  sku: string;

  images: string[];
  thumbnail?: string | null;
  video?: string | null;

  tags?: string[];

  variant?: Types.ObjectId[];

  shipping?: {
    weight?: number;
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
    };
  };

  warranty?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  isDelete?: boolean;
}
