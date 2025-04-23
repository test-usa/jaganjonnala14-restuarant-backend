import mongoose from "mongoose";
import { IAttribute } from "./attribute.interface";

const attributeSchema = new mongoose.Schema<IAttribute>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
    },
    attributeOption: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "attributeOption",
      },
    ],
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

export const attributeModel = mongoose.model("attribute", attributeSchema);
