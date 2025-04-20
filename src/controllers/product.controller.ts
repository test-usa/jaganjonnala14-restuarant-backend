import type { Request, Response, NextFunction } from "express"
import { Product } from "../models/product.model"
import { Category } from "../models/category.model"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"

// Get all products
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      category,
      search,
      status,
      isPopular,
      isOffer,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = req.query

    // Build query
    const query: any = {}

    if (category) {
      query.category = category
    }

    if (status) {
      query.status = status
    }

    if (isPopular) {
      query.isPopular = isPopular === "true"
    }

    if (isOffer) {
      query.isOffer = isOffer === "true"
    }

    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Count total documents
    const total = await Product.countDocuments(query)

    // Pagination
    const skip = (Number(page) - 1) * Number(limit)

    // Get products
    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ [sortBy as string]: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit))

    res.status(200).json(
      new ApiResponse(
        200,
        {
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

// Get product by ID
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const product = await Product.findById(id).populate("category", "name")
    if (!product) {
      throw new ApiError(404, "Product not found")
    }

    res.status(200).json(new ApiResponse(200, { product }, "Product fetched successfully"))
  } catch (error) {
    next(error)
  }
}

// Create product
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, category, variants, image, isPopular, isOffer, offerPrice, offerDescription, stock } =
      req.body

    // Check if category exists
    const categoryExists = await Category.findById(category)
    if (!categoryExists) {
      throw new ApiError(404, "Category not found")
    }

    // Create product
    const product = await Product.create({
      name,
      description,
      category,
      variants,
      image,
      isPopular,
      isOffer,
      offerPrice,
      offerDescription,
      stock,
      status: stock > 0 ? "active" : "out_of_stock",
    })

    res.status(201).json(new ApiResponse(201, { product }, "Product created successfully"))
  } catch (error) {
    next(error)
  }
}

// Update product
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const {
      name,
      description,
      category,
      variants,
      image,
      isPopular,
      isOffer,
      offerPrice,
      offerDescription,
      stock,
      status,
    } = req.body

    // Check if product exists
    const product = await Product.findById(id)
    if (!product) {
      throw new ApiError(404, "Product not found")
    }

    // Check if category exists
    if (category) {
      const categoryExists = await Category.findById(category)
      if (!categoryExists) {
        throw new ApiError(404, "Category not found")
      }
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        category,
        variants,
        image,
        isPopular,
        isOffer,
        offerPrice,
        offerDescription,
        stock,
        status: status || (stock > 0 ? "active" : "out_of_stock"),
      },
      { new: true, runValidators: true },
    ).populate("category", "name")

    res.status(200).json(new ApiResponse(200, { product: updatedProduct }, "Product updated successfully"))
  } catch (error) {
    next(error)
  }
}

// Delete product
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    // Check if product exists
    const product = await Product.findById(id)
    if (!product) {
      throw new ApiError(404, "Product not found")
    }

    // Delete product
    await Product.findByIdAndDelete(id)

    res.status(200).json(new ApiResponse(200, {}, "Product deleted successfully"))
  } catch (error) {
    next(error)
  }
}

// Update product stock
export const updateProductStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { stock } = req.body

    if (stock === undefined || stock < 0) {
      throw new ApiError(400, "Stock must be a non-negative number")
    }

    // Check if product exists
    const product = await Product.findById(id)
    if (!product) {
      throw new ApiError(404, "Product not found")
    }

    // Update stock
    product.stock = stock
    product.status = stock > 0 ? "active" : "out_of_stock"
    await product.save()

    res.status(200).json(new ApiResponse(200, { product }, "Product stock updated successfully"))
  } catch (error) {
    next(error)
  }
}

// Get popular products
export const getPopularProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = 8 } = req.query

    const products = await Product.find({ isPopular: true, status: "active" })
      .populate("category", "name")
      .limit(Number(limit))

    res.status(200).json(new ApiResponse(200, { products }, "Popular products fetched successfully"))
  } catch (error) {
    next(error)
  }
}

// Get special offers
export const getSpecialOffers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = 8 } = req.query

    const products = await Product.find({ isOffer: true, status: "active" })
      .populate("category", "name")
      .limit(Number(limit))

    res.status(200).json(new ApiResponse(200, { products }, "Special offers fetched successfully"))
  } catch (error) {
    next(error)
  }
}
