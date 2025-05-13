import { Schema, model, Document, Types } from "mongoose";
import { IOrder } from "./order.interface";

const OrderSchema = new Schema<IOrder>(
  {
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    table: { type: Schema.Types.ObjectId, ref: "Table", required: true },
    menus: [{ type: Types.ObjectId, ref: "Menu", required: true }],
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    orderType: {
      type: String,
      enum: ["dine in", "takeaway"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "inProgress", "delivered", "cancel"],
      default: "pending",
    },
    specialRequest: { type: String, default: "" },
    total: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

export const OrderModel = model<IOrder>("Order", OrderSchema);
