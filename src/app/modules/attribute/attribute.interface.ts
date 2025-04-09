import { ObjectId } from "mongoose";

// attribute.interface.ts - attribute module
export interface IAttribute {
    name: string;
    attributeOption?:ObjectId[];
    isDelete: boolean;
  }
  