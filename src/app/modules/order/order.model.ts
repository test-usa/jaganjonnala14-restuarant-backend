import mongoose, { Types } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      email: { type: String },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    customerId: { type: Types.ObjectId, ref: "user" },
    payment: {
      type: {
        type: String,
        enum: ["manual", "cashOnDelivery", "SSLCommerz"],
        required: true,
      },
      method: {
        type: String,
        enum: ["bkash", "nagad", "upay", "rocket", null],
        default: null,
      },
      transactionId: { type: String },
     
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    delivery: {
      location: { type: String, enum: ["inside", "outside"], required: true },
      fee: { type: Number, required: true },
    },
    coupon: {
      code: { type: String },
      discount: { type: Number },
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    transactionId: { type: String },
    paymentDate: { type: Date},
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const orderModel = mongoose.model("order", orderSchema);
