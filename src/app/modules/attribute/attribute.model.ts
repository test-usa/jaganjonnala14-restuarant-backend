import mongoose, { Schema } from "mongoose";
import { IAttribute } from "./attribute.interface";

// attribute.model.ts - attribute module
const AttributeSchema = new Schema<IAttribute>(
  {
    name: { type: String, required: true },
    attributeOption: [{ type: Schema.Types.ObjectId, ref: "AttributeOption", }], // Reference array
    isDelete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AttributeModel = mongoose.model<IAttribute>(
  "Attribute",
  AttributeSchema
);
