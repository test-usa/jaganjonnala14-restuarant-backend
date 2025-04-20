import type { Request, Response, NextFunction } from "express"
import { User } from "../models/user.model"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"

// Register a new user
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, phone, address } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new ApiError(409, "User with this email already exists")
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      role: "customer", // Default role
    })

    // Generate token
    const token = user.generateAuthToken()

    // Remove password from response
    const userWithoutPassword = await User.findById(user._id).select("-password")

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })

    // Send response
    res.status(201).json(
      new ApiResponse(
        201,
        {
          user: userWithoutPassword,
          token,
        },
        "User registered successfully",
      ),
    )
  } catch (error) {
    next(error)
  }
}

// Login user
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      throw new ApiError(401, "Invalid email or password")
    }

    // Check if password is correct
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password")
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ApiError(403, "Your account has been deactivated")
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate token
    const token = user.generateAuthToken()

    // Remove password from response
    const userWithoutPassword = await User.findById(user._id).select("-password")

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })

    // Send response
    res.status(200).json(
      new ApiResponse(
        200,
        {
          user: userWithoutPassword,
          token,
        },
        "Login successful",
      ),
    )
  } catch (error) {
    next(error)
  }
}

// Logout user
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("token")
    res.status(200).json(new ApiResponse(200, {}, "Logout successful"))
  } catch (error) {
    next(error)
  }
}

// Get current user
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user
    res.status(200).json(new ApiResponse(200, { user }, "User fetched successfully"))
  } catch (error) {
    next(error)
  }
}

// Change password
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body
    const userId = req.user._id

    // Get user with password
    const user = await User.findById(userId).select("+password")
    if (!user) {
      throw new ApiError(404, "User not found")
    }

    // Check if current password is correct
    const isPasswordValid = await user.comparePassword(currentPassword)
    if (!isPasswordValid) {
      throw new ApiError(401, "Current password is incorrect")
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"))
  } catch (error) {
    next(error)
  }
}
