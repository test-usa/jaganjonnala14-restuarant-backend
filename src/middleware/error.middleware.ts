import type { Request, Response, NextFunction } from "express"
import { ApiError } from "../utils/ApiError"

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err)

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    })
  }

  // MongoDB duplicate key error
  if (err.name === "MongoServerError" && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0]
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
    })
  }

  // MongoDB validation error
  if (err.name === "ValidationError") {
    const errors = Object.values((err as any).errors).map((val: any) => val.message)
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors,
    })
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    })
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    })
  }

  // Default error
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  })
}
