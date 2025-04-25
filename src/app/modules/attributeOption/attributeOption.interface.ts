import { Document } from "mongoose";

export interface IAttributeOption extends Document {
  name: string;
  image?: string | null;
  price?: number;
  description?: string;
  value: string;
  slug?: string;
  isActive: boolean;
  isDelete: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
