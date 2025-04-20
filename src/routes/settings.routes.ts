import express from "express"
import { getSettings, updateSettings, updateRewardSettings } from "../controllers/settings.controller"
import { isAuthenticated, isAdmin } from "../middleware/auth.middleware"

const router = express.Router()

// Admin routes
router.get("/", isAuthenticated, isAdmin, getSettings)
router.put("/", isAuthenticated, isAdmin, updateSettings)
router.put("/rewards", isAuthenticated, isAdmin, updateRewardSettings)

export default router
