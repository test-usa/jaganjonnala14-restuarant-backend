import mongoose, { Schema } from "mongoose";
import { IAttributeOption } from "./attributeOption.interface";

const attributeOptionSchema = new mongoose.Schema<IAttributeOption>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    description: {
      type: String,
    },

    value: {
      type: String,
      trim: true,
    },

    slug: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const attributeOptionModel = mongoose.model<IAttributeOption>(
  "attributeOption",
  attributeOptionSchema
);
