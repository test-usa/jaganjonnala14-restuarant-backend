import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError"
import { User } from "../models/user.model"

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from cookies or authorization header
    const token =
      req.cookies.token ||
      (req.headers.authorization && req.headers.authorization.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : null)

    if (!token) {
      throw new ApiError(401, "Authentication required")
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    // Find user
    const user = await User.findById((decoded as any).id).select("-password")

    if (!user) {
      throw new ApiError(401, "User not found")
    }

    // Add user to request
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    next(new ApiError(403, "Admin access required"))
  }
}

export const isEmployee = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user.role === "employee" || req.user.role === "admin")) {
    next()
  } else {
    next(new ApiError(403, "Employee access required"))
  }
}

export const isCustomer = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "customer") {
    next()
  } else {
    next(new ApiError(403, "Customer access required"))
  }
}
