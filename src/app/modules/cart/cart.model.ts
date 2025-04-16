import mongoose, { Types } from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
    },
    user: {
      type: Types.ObjectId,
      ref: "user",
    },
    product: {
      type: Types.ObjectId,
      ref: "product",
    },
    quantity: {
      type: Number,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    isCheckout: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-update cart total before saving

export const cartModel = mongoose.model("cart", cartSchema);
