import type { Request, Response, NextFunction } from "express"
import { Category } from "../models/category.model"
import { Product } from "../models/product.model"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"

// Get all categories
export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { active } = req.query

    // Build query
    const query: any = {}

    if (active) {
      query.isActive = active === "true"
    }

    const categories = await Category.find(query)

    res.status(200).json(new ApiResponse(200, { categories }, "Categories fetched successfully"))
  } catch (error) {
    next(error)
  }
}

// Get category by ID
export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const category = await Category.findById(id)
    if (!category) {
      throw new ApiError(404, "Category not found")
    }

    res.status(200).json(new ApiResponse(200, { category }, "Category fetched successfully"))
  } catch (error) {
    next(error)
  }
}

// Create category
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, image } = req.body

    // Check if category already exists
    const existingCategory = await Category.findOne({ name })
    if (existingCategory) {
      throw new ApiError(409, "Category with this name already exists")
    }

    // Create category
    const category = await Category.create({
      name,
      description,
      image,
      isActive: true,
    })

    res.status(201).json(new ApiResponse(201, { category }, "Category created successfully"))
  } catch (error) {
    next(error)
  }
}

// Update category
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { name, description, image, isActive } = req.body

    // Check if category exists
    const category = await Category.findById(id)
    if (!category) {
      throw new ApiError(404, "Category not found")
    }

    // Check if name is already taken
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name })
      if (existingCategory) {
        throw new ApiError(409, "Category with this name already exists")
      }
    }

    // Update category
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description, image, isActive },
      { new: true, runValidators: true },
    )

    res.status(200).json(new ApiResponse(200, { category: updatedCategory }, "Category updated successfully"))
  } catch (error) {
    next(error)
  }
}

// Delete category
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    // Check if category exists
    const category = await Category.findById(id)
    if (!category) {
      throw new ApiError(404, "Category not found")
    }

    // Check if category has products
    const productsCount = await Product.countDocuments({ category: id })
    if (productsCount > 0) {
      throw new ApiError(
        400,
        `Cannot delete category with ${productsCount} products. Please reassign or delete the products first.`,
      )
    }

    // Delete category
    await Category.findByIdAndDelete(id)

    res.status(200).json(new ApiResponse(200, {}, "Category deleted successfully"))
  } catch (error) {
    next(error)
  }
}

// Get products by category
export const getProductsByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { limit = 20, page = 1 } = req.query

    // Check if category exists
    const category = await Category.findById(id)
    if (!category) {
      throw new ApiError(404, "Category not found")
    }

    // Count total products
    const total = await Product.countDocuments({ category: id })

    // Pagination
    const skip = (Number(page) - 1) * Number(limit)

    // Get products
    const products = await Product.find({ category: id }).skip(skip).limit(Number(limit))

    res.status(200).json(
      new ApiResponse(
        200,
        {
          category,
          products,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit)),
          },
        },
        "Products fetched successfully",
      ),
    )
  } catch (error) {
    next(error)
  }
}

// Get category with product count
export const getCategoriesWithProductCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          isActive: 1,
          productCount: { $size: "$products" },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ])

    res.status(200).json(new ApiResponse(200, { categories }, "Categories with product count fetched successfully"))
  } catch (error) {
    next(error)
  }
}
