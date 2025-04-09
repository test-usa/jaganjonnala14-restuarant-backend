// attributeOption.model.ts - attributeOption module
import mongoose from "mongoose";

const AttributeOptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["color", "other"],
      required: true,
    },
    colorCode: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const AttributeOptionModel = mongoose.model(
  "AttributeOption",
  AttributeOptionSchema
);
export default AttributeOptionModel;
