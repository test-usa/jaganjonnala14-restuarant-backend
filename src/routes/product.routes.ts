import express from "express"
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  getPopularProducts,
  getSpecialOffers,
} from "../controllers/product.controller"
import { isAuthenticated, isAdmin, isEmployee } from "../middleware/auth.middleware"

const router = express.Router()

// Public routes
router.get("/", getAllProducts)
router.get("/popular", getPopularProducts)
router.get("/offers", getSpecialOffers)
router.get("/:id", getProductById)

// Admin/Employee routes
router.post("/", isAuthenticated, isAdmin, createProduct)
router.put("/:id", isAuthenticated, isAdmin, updateProduct)
router.delete("/:id", isAuthenticated, isAdmin, deleteProduct)
router.patch("/:id/stock", isAuthenticated, isEmployee, updateProductStock)

export default router
