import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        variant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AttributeOption",
          },
        price: {
          type: Number,
          required: true,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    cartTotalCost: {
      type: Number,
      required: true,
      default: 0,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    // Flag to indicate whether the cart is ready for checkout or not. Default is false.
    isCheckout: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true });

  // Auto-update cart total before saving
 

export const cartModel = mongoose.model("cart", cartSchema);