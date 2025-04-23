import { ObjectId } from "mongoose";

export interface IAttribute {
  name: string;
  description?: string;
  slug?: string;
  attributeOption?: ObjectId[];
  isDelete: boolean;
  isActive: boolean;
}
