import express from "express"
import {
  getRewardSettings,
  getCustomerLeaderboard,
  addRewardPoints,
  getCustomerRewardPoints,
  distributeMonthlyRewards,
} from "../controllers/reward.controller"
import { isAuthenticated, isAdmin, isCustomer } from "../middleware/auth.middleware"

const router = express.Router()

// Public routes
router.get("/settings", getRewardSettings)
router.get("/leaderboard", getCustomerLeaderboard)

// Customer routes
router.get("/my-points", isAuthenticated, isCustomer, getCustomerRewardPoints)

// Admin routes
router.post("/customers/:customerId/add", isAuthenticated, isAdmin, addRewardPoints)
router.post("/distribute-monthly", isAuthenticated, isAdmin, distributeMonthlyRewards)

export default router
