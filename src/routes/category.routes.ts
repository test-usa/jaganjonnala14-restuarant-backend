import express from "express"
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategory,
  getCategoriesWithProductCount,
} from "../controllers/category.controller"
import { isAuthenticated, isAdmin } from "../middleware/auth.middleware"

const router = express.Router()

// Public routes
router.get("/", getAllCategories)
router.get("/with-product-count", getCategoriesWithProductCount)
router.get("/:id", getCategoryById)
router.get("/:id/products", getProductsByCategory)

// Admin routes
router.post("/", isAuthenticated, isAdmin, createCategory)
router.put("/:id", isAuthenticated, isAdmin, updateCategory)
router.delete("/:id", isAuthenticated, isAdmin, deleteCategory)

export default router
