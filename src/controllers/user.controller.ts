import type { Request, Response, NextFunction } from "express"
import { User } from "../models/user.model"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"

// Get all users (admin only)
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role, search, status } = req.query

    // Build query
    const query: any = {}

    if (role) {
      query.role = role
    }

    if (status) {
      query.isActive = status === "active"
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ]
    }

    const users = await User.find(query).select("-password")

    res.status(200).json(new ApiResponse(200, { users }, "Users fetched successfully"))
  } catch (error) {
    next(error)
  }
}

// Get user by ID
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const user = await User.findById(id).select("-password")
    if (!user) {
      throw new ApiError(404, "User not found")
    }

    res.status(200).json(new ApiResponse(200, { user }, "User fetched successfully"))
  } catch (error) {
    next(error)
  }
}

// Update user
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { name, email, phone, address } = req.body

    // Check if user exists
    const user = await User.findById(id)
    if (!user) {
      throw new ApiError(404, "User not found")
    }

    // Check if email is already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        throw new ApiError(409, "Email is already taken")
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, phone, address },
      { new: true, runValidators: true },
    ).select("-password")

    res.status(200).json(new ApiResponse(200, { user: updatedUser }, "User updated successfully"))
  } catch (error) {
    next(error)
  }
}

// Update user role (admin only)
export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { role } = req.body

    // Check if user exists
    const user = await User.findById(id)
    if (!user) {
      throw new ApiError(404, "User not found")
    }

    // Update role
    const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true }).select(
      "-password",
    )

    res.status(200).json(new ApiResponse(200, { user: updatedUser }, "User role updated successfully"))
  } catch (error) {
    next(error)
  }
}

// Toggle user status (active/inactive)
export const toggleUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    // Check if user exists
    const user = await User.findById(id)
    if (!user) {
      throw new ApiError(404, "User not found")
    }

    // Toggle status
    user.isActive = !user.isActive
    await user.save()

    res
      .status(200)
      .json(new ApiResponse(200, { user }, `User ${user.isActive ? "activated" : "deactivated"} successfully`))
  } catch (error) {
    next(error)
  }
}

// Add reward points to user
export const addRewardPoints = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { points } = req.body

    if (!points || points <= 0) {
      throw new ApiError(400, "Points must be a positive number")
    }

    // Check if user exists
    const user = await User.findById(id)
    if (!user) {
      throw new ApiError(404, "User not found")
    }

    // Add points
    user.rewardPoints += points
    await user.save()

    res.status(200).json(new ApiResponse(200, { user }, `${points} reward points added successfully`))
  } catch (error) {
    next(error)
  }
}

// Get top customers
export const getTopCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = 10 } = req.query

    // Get users with most reward points
    const topCustomers = await User.find({ role: "customer" })
      .sort({ rewardPoints: -1 })
      .limit(Number(limit))
      .select("-password")

    res.status(200).json(new ApiResponse(200, { customers: topCustomers }, "Top customers fetched successfully"))
  } catch (error) {
    next(error)
  }
}
