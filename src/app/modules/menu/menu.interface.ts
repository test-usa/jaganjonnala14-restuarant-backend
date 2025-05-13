import mongoose, { Types } from "mongoose";

type IMenuSize = "small" | "large" | "medium";

export interface Imenu {
  category: Types.ObjectId;
  restaurant: Types.ObjectId;
  itemName: string;
  price: Number;
  size: IMenuSize;
  availability: Boolean;
  description: string;
  rating: Number;
  like: number;
  isDelete: boolean;
}
