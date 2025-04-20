import express from "express"
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  getCustomerOrders,
  getOrderStatistics,
} from "../controllers/order.controller"
import { isAuthenticated, isAdmin, isEmployee, isCustomer } from "../middleware/auth.middleware"

const router = express.Router()

// Admin routes
router.get("/", isAuthenticated, isEmployee, getAllOrders)
router.get("/statistics", isAuthenticated, isAdmin, getOrderStatistics)

// Customer routes
router.get("/my-orders", isAuthenticated, isCustomer, getCustomerOrders)
router.post("/", isAuthenticated, isCustomer, createOrder)

// Common routes
router.get("/:id", isAuthenticated, getOrderById)

// Admin/Employee routes
router.patch("/:id/status", isAuthenticated, isEmployee, updateOrderStatus)
router.patch("/:id/payment", isAuthenticated, isEmployee, updatePaymentStatus)

export default router
