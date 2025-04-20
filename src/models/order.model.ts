import mongoose, { type Document, Schema } from "mongoose"

interface IOrderItem {
  product: mongoose.Types.ObjectId
  variant: string
  quantity: number
  price: number
}

export interface IOrder extends Document {
  customer: mongoose.Types.ObjectId
  items: IOrderItem[]
  totalAmount: number
  status: "pending" | "processing" | "ready" | "delivered" | "cancelled"
  paymentMethod: "cash" | "online" | "manual"
  paymentStatus: "pending" | "paid" | "refunded" | "failed"
  transactionId?: string
  address: string
  notes?: string
  deliveryFee: number
  tax: number
  rewardPointsEarned: number
  rewardPointsRedeemed: number
  createdAt: Date
  updatedAt: Date
}

const orderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variant: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"],
  },
})

const orderSchema = new Schema<IOrder>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },
    status: {
      type: String,
      enum: ["pending", "processing", "ready", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "online", "manual"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded", "failed"],
      default: "pending",
    },
    transactionId: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    rewardPointsEarned: {
      type: Number,
      default: 0,
    },
    rewardPointsRedeemed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
)

export const Order = mongoose.model<IOrder>("Order", orderSchema)
