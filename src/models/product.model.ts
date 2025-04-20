import mongoose, { type Document, Schema } from "mongoose"

interface IVariant {
  _id?: string;
  name: string
  price: number
}

export interface IProduct extends Document {
  name: string
  description: string
  category: mongoose.Types.ObjectId
  variants: IVariant[]
  image: string
  isPopular: boolean
  isOffer: boolean
  offerPrice?: number
  offerDescription?: string
  stock: number
  status: "active" | "out_of_stock" | "discontinued"
  createdAt: Date
  updatedAt: Date
}

const variantSchema = new Schema<IVariant>(
  {
    name: {
      type: String,
      required: [true, "Variant name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Variant price is required"],
      min: [0, "Price cannot be negative"],
    },
  },
  { _id: true },
)

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    variants: [variantSchema],
    image: {
      type: String,
      default: "/placeholder.svg",
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isOffer: {
      type: Boolean,
      default: false,
    },
    offerPrice: {
      type: Number,
      min: [0, "Offer price cannot be negative"],
    },
    offerDescription: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "out_of_stock", "discontinued"],
      default: "active",
    },
  },
  { timestamps: true },
)

// Update status based on stock
productSchema.pre("save", function (next) {
  if (this.stock <= 0) {
    this.status = "out_of_stock"
  } else if (this.status === "out_of_stock" && this.stock > 0) {
    this.status = "active"
  }
  next()
})

export const Product = mongoose.model<IProduct>("Product", productSchema)
