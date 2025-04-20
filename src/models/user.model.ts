import mongoose, { type Document, Schema } from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  phone?: string
  address?: string
  role: "admin" | "employee" | "customer"
  rewardPoints: number
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
  comparePassword: (password: string) => Promise<boolean>
  generateAuthToken: () => string
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "employee", "customer"],
      default: "customer",
    },
    rewardPoints: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true },
)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password)
}

// Generate JWT token
userSchema.methods.generateAuthToken = function (): string {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: process.env.JWT_EXPIRES_IN || "30d" } as jwt.SignOptions
  )
}

export const User = mongoose.model<IUser>("User", userSchema)
