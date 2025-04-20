import express from "express"
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  toggleUserStatus,
  addRewardPoints,
  getTopCustomers,
} from "../controllers/user.controller"
import { isAuthenticated, isAdmin } from "../middleware/auth.middleware"

const router = express.Router()

// Admin routes
router.get("/", isAuthenticated, isAdmin, getAllUsers)
router.get("/top", isAuthenticated, isAdmin, getTopCustomers)
router.patch("/:id/role", isAuthenticated, isAdmin, updateUserRole)
router.patch("/:id/status", isAuthenticated, isAdmin, toggleUserStatus)
router.post("/:id/reward-points", isAuthenticated, isAdmin, addRewardPoints)

// User routes
router.get("/:id", isAuthenticated, getUserById)
router.put("/:id", isAuthenticated, updateUser)

export default router
