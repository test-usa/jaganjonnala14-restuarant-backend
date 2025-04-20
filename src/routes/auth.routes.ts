import express from "express"
import { register, login, logout, getCurrentUser, changePassword } from "../controllers/auth.controller"
import { isAuthenticated } from "../middleware/auth.middleware"

const router = express.Router()

// Public routes
router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)

// Protected routes
router.get("/me", isAuthenticated, getCurrentUser)
router.post("/change-password", isAuthenticated, changePassword)

export default router
