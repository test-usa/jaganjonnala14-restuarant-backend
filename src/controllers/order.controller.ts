import type { Request, Response, NextFunction } from "express"
import { Order } from "../models/order.model"
import { Product } from "../models/product.model"
import { User } from "../models/user.model"
import { Settings } from "../models/settings.model"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"

// Get all orders
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      status,
      paymentMethod,
      paymentStatus,
      customer,
      dateFrom,
      dateTo,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = req.query

    // Build query
    const query: any = {}

    if (status) {
      query.status = status
    }

    if (paymentMethod) {
      query.paymentMethod = paymentMethod
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus
    }

    if (customer) {
      query.customer = customer
    }

    // Date range
    if (dateFrom || dateTo) {
      query.createdAt = {}

      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom as string)
      }

      if (dateTo) {
        query.createdAt.$lte = new Date(dateTo as string)
      }
    }

    // Count total documents
    const total = await Order.countDocuments(query)

    // Pagination
    const skip = (Number(page) - 1) * Number(limit)

    // Get orders
    const orders = await Order.find(query)
      .populate("customer", "name email phone")
      .sort({ [sortBy as string]: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit))

    res.status(200).json(
      new ApiResponse(
        200,
        {
          orders,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit)),
          },
        },
        "Orders fetched successfully",
      ),
    )
  } catch (error) {
    next(error)
  }
}

// Get order by ID
export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const order = await Order.findById(id)
      .populate("customer", "name email phone address")
      .populate("items.product", "name image")

    if (!order) {
      throw new ApiError(404, "Order not found")
    }

    res.status(200).json(new ApiResponse(200, { order }, "Order fetched successfully"))
  } catch (error) {
    next(error)
  }
}

// Create order
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, paymentMethod, address, notes, rewardPointsRedeemed = 0 } = req.body

    const customerId = req.user._id

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, "Order must contain at least one item")
    }

    // Get settings for tax and delivery fee
    const settings = await Settings.findOne()
    const taxRate = settings?.taxRate || 0.08 // Default 8%
    const deliveryFee = settings?.deliveryFee || 2.99
    const pointsPerDollar = settings?.pointsPerDollar || 10

    // Calculate order details
    let subtotal = 0
    const orderItems = []

    // Validate and process each item
    for (const item of items) {
      const { productId, variantId, quantity } = item

      if (!productId || !variantId || !quantity || quantity <= 0) {
        throw new ApiError(400, "Invalid item details")
      }

      // Get product
      const product = await Product.findById(productId)
      if (!product) {
        throw new ApiError(404, `Product with ID ${productId} not found`)
      }

      // Check if product is active
      if (product.status !== "active") {
        throw new ApiError(400, `Product ${product.name} is not available`)
      }

      // Find variant
      const variant = product.variants.find((v) => v._id?.toString() === variantId)
      if (!variant) {
        throw new ApiError(404, `Variant not found for product ${product.name}`)
      }

      // Check stock
      if (product.stock < quantity) {
        throw new ApiError(400, `Not enough stock for ${product.name}`)
      }

      // Calculate item price
      const price = variant.price
      const itemTotal = price * quantity
      subtotal += itemTotal

      // Add to order items
      orderItems.push({
        product: productId,
        variant: variant.name,
        quantity,
        price,
      })

      // Update product stock
      product.stock -= quantity
      await product.save()
    }

    // Calculate tax and total
    const tax = subtotal * taxRate
    const total = subtotal + tax + deliveryFee

    // Handle reward points
    let finalTotal = total
    const customer = await User.findById(customerId)

    if (!customer) {
      throw new ApiError(404, "Customer not found")
    }

    // Validate reward points redemption
    if (rewardPointsRedeemed > 0) {
      if (rewardPointsRedeemed > customer.rewardPoints) {
        throw new ApiError(400, "Not enough reward points")
      }

      // Calculate points value (1 point = 1 cent)
      const pointsValue = rewardPointsRedeemed / 100 // Convert to dollars
      finalTotal = Math.max(0, finalTotal - pointsValue)

      // Deduct points from customer
      customer.rewardPoints -= rewardPointsRedeemed
      await customer.save()
    }

    // Calculate reward points earned (rounded to nearest integer)
    const rewardPointsEarned = Math.round(subtotal * pointsPerDollar)

    // Create order
    const order = await Order.create({
      customer: customerId,
      items: orderItems,
      totalAmount: finalTotal,
      status: "pending",
      paymentMethod,
      paymentStatus: paymentMethod === "cash" ? "pending" : "pending",
      address,
      notes,
      deliveryFee,
      tax,
      rewardPointsEarned,
      rewardPointsRedeemed,
    })

    // Add earned points to customer
    customer.rewardPoints += rewardPointsEarned
    await customer.save()

    res.status(201).json(new ApiResponse(201, { order }, "Order created successfully"))
  } catch (error) {
    next(error)
  }
}

// Update order status
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { status } = req.body

    // Validate status
    const validStatuses = ["pending", "processing", "ready", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, "Invalid status")
    }

    // Find order
    const order = await Order.findById(id)
    if (!order) {
      throw new ApiError(404, "Order not found")
    }

    // Handle cancellation
    if (status === "cancelled" && order.status !== "cancelled") {
      // Restore product stock
      for (const item of order.items) {
        const product = await Product.findById(item.product)
        if (product) {
          product.stock += item.quantity
          await product.save()
        }
      }

      // Refund reward points if they were redeemed
      if (order.rewardPointsRedeemed > 0) {
        const customer = await User.findById(order.customer)
        if (customer) {
          customer.rewardPoints += order.rewardPointsRedeemed

          // Remove earned points
          customer.rewardPoints -= order.rewardPointsEarned
          await customer.save()
        }
      }

      // Update payment status if needed
      if (order.paymentStatus === "paid") {
        order.paymentStatus = "refunded"
      }
    }

    // Update order status
    order.status = status
    await order.save()

    res.status(200).json(new ApiResponse(200, { order }, "Order status updated successfully"))
  } catch (error) {
    next(error)
  }
}

// Update payment status
export const updatePaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { paymentStatus, transactionId } = req.body

    // Validate status
    const validStatuses = ["pending", "paid", "refunded", "failed"]
    if (!validStatuses.includes(paymentStatus)) {
      throw new ApiError(400, "Invalid payment status")
    }

    // Find order
    const order = await Order.findById(id)
    if (!order) {
      throw new ApiError(404, "Order not found")
    }

    // Update payment status
    order.paymentStatus = paymentStatus
    if (transactionId) {
      order.transactionId = transactionId
    }
    await order.save()

    res.status(200).json(new ApiResponse(200, { order }, "Payment status updated successfully"))
  } catch (error) {
    next(error)
  }
}

// Get customer orders
export const getCustomerOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customerId = req.user._id
    const { status, page = 1, limit = 10 } = req.query

    // Build query
    const query: any = { customer: customerId }

    if (status) {
      query.status = status
    }

    // Count total documents
    const total = await Order.countDocuments(query)

    // Pagination
    const skip = (Number(page) - 1) * Number(limit)

    // Get orders
    const orders = await Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit))

    res.status(200).json(
      new ApiResponse(
        200,
        {
          orders,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit)),
          },
        },
        "Customer orders fetched successfully",
      ),
    )
  } catch (error) {
    next(error)
  }
}

// Get order statistics
export const getOrderStatistics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Count orders by status
    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    // Format status counts
    const statusStats = {
      pending: 0,
      processing: 0,
      ready: 0,
      delivered: 0,
      cancelled: 0,
    }

    statusCounts.forEach((item) => {
      if (item._id in statusStats) {
        statusStats[item._id as keyof typeof statusStats] = item.count
      }
    })

    // Get total revenue
    const revenueData = await Order.aggregate([
      {
        $match: {
          status: { $ne: "cancelled" },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },
    ])

    const revenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0
    const completedOrders = revenueData.length > 0 ? revenueData[0].orderCount : 0

    // Get today's orders
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today },
    })

    res.status(200).json(
      new ApiResponse(
        200,
        {
          statusStats,
          revenue,
          completedOrders,
          todayOrders,
        },
        "Order statistics fetched successfully",
      ),
    )
  } catch (error) {
    next(error)
  }
}
