import mongoose, { type Document, Schema } from "mongoose"

export interface ISettings extends Document {
  restaurantName: string
  logo?: string
  primaryColor?: string
  contactEmail: string
  contactPhone: string
  address: string
  taxRate: number
  deliveryFee: number
  rewardsEnabled: boolean
  pointsPerDollar: number
  minRedemptionPoints: number
  pointsValueInCents: number
  leaderboardEnabled: boolean
  leaderboardReset: "monthly" | "quarterly" | "yearly"
  topCustomersCount: number
  updatedAt: Date
}

const settingsSchema = new Schema<ISettings>(
  {
    restaurantName: {
      type: String,
      required: [true, "Restaurant name is required"],
      default: "Tasty Bites",
    },
    logo: {
      type: String,
    },
    primaryColor: {
      type: String,
      default: "#0f172a",
    },
    contactEmail: {
      type: String,
      required: [true, "Contact email is required"],
      default: "contact@tastybites.com",
    },
    contactPhone: {
      type: String,
      required: [true, "Contact phone is required"],
      default: "+1 (555) 123-4567",
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      default: "123 Main St, New York, NY 10001",
    },
    taxRate: {
      type: Number,
      required: [true, "Tax rate is required"],
      default: 0.08, // 8%
    },
    deliveryFee: {
      type: Number,
      required: [true, "Delivery fee is required"],
      default: 2.99,
    },
    rewardsEnabled: {
      type: Boolean,
      default: true,
    },
    pointsPerDollar: {
      type: Number,
      default: 10,
    },
    minRedemptionPoints: {
      type: Number,
      default: 100,
    },
    pointsValueInCents: {
      type: Number,
      default: 1,
    },
    leaderboardEnabled: {
      type: Boolean,
      default: true,
    },
    leaderboardReset: {
      type: String,
      enum: ["monthly", "quarterly", "yearly"],
      default: "monthly",
    },
    topCustomersCount: {
      type: Number,
      default: 3,
    },
  },
  { timestamps: true },
)

export const Settings = mongoose.model<ISettings>("Settings", settingsSchema)
