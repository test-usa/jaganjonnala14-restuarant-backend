import mongoose, { Types } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
    },
    phone: {
      type: Number,
      require: true,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
    },
    user: {
      type: Types.ObjectId,
      ref: "user",
      require: true,
    },
    products: [
      {
        product: {
          type: Types.ObjectId,
          require: true,
        },
        productName: {
          type: String,
          require: true,
        },
        quantity: {
          type: Number,
        },
        sku: {
          type: String,
        },
      },
    ],
    orderId: {
      type: String, 
    },
    paymentMethod: {
      type: String
    },
    code: {
      type: String
    },
    delivery: {
      type : String
    },
    subTotal: {
      type: Number
    },
    shippingFee: {
      type: Number
    },
    extraFee: {
      type: Number
    },
    discount: {
      type : Number
    },
    grandTotal: {
      type: Number
    },
    transactionId: {
      type: String
    },
    paymentStatus: {
      type: String
    },
    deliveryStatus: {
      type: String
    },
    orderstatus: {
      type: String
    }
  },
  { timestamps: true }
);

export const orderModel = mongoose.model("order", orderSchema);
