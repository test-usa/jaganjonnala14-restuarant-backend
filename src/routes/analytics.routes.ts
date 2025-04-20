import express from "express"
import {
  getRevenueAnalytics,
  getProductCategoryAnalytics,
  getOrderTrends,
  getPaymentMethodAnalytics,
  getTopProducts,
  getCustomerAcquisition,
  getDashboardAnalytics,
} from "../controllers/analytics.controller"
import { isAuthenticated, isAdmin } from "../middleware/auth.middleware"

const router = express.Router()

// Admin routes
router.get("/revenue", isAuthenticated, isAdmin, getRevenueAnalytics)
router.get("/categories", isAuthenticated, isAdmin, getProductCategoryAnalytics)
router.get("/orders", isAuthenticated, isAdmin, getOrderTrends)
router.get("/payment-methods", isAuthenticated, isAdmin, getPaymentMethodAnalytics)
router.get("/top-products", isAuthenticated, isAdmin, getTopProducts)
router.get("/customers", isAuthenticated, isAdmin, getCustomerAcquisition)
router.get("/dashboard", isAuthenticated, isAdmin, getDashboardAnalytics)

export default router
