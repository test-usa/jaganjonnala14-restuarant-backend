import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "users", required: true },

    items: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "products",
          required: true,
        },
        selectedAttributes: [
          {
            attribute: { type: mongoose.Types.ObjectId, ref: "attribute" },
            option: { type: mongoose.Types.ObjectId, ref: "attributeOption" },
          },
        ],
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // Single item price
        subtotal: { type: Number, required: true }, // quantity * price
      },
    ],

    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "preparing", "completed", "cancelled"],
      default: "pending",
    },

    shippingAddress: { type: String }, // Optional jodi delivery thake

    isDelete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const orderModel = mongoose.model("orders", orderSchema);
