import type { Request, Response, NextFunction } from "express"
import { Order } from "../models/order.model"
import { User } from "../models/user.model"
import { ApiResponse } from "../utils/ApiResponse"

// Get revenue analytics
export const getRevenueAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { period = "monthly" } = req.query

    let dateFormat: string
    let limit: number

    // Set date format and limit based on period
    switch (period) {
      case "daily":
        dateFormat = "%Y-%m-%d"
        limit = 7 // Last 7 days
        break
      case "weekly":
        dateFormat = "%Y-W%U" // Year-Week format
        limit = 4 // Last 4 weeks
        break
      case "monthly":
      default:
        dateFormat = "%Y-%m"
        limit = 7 // Last 7 months
        break
    }

    // Get revenue data
    const revenueData = await Order.aggregate([
      {
        $match: {
          status: { $ne: "cancelled" },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          profit: { $sum: { $multiply: ["$totalAmount", 0.4] } }, // Assuming 40% profit margin
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $limit: limit,
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          revenue: 1,
          profit: 1,
        },
      },
    ])

    res.status(200).json(new ApiResponse(200, { revenueData }, "Revenue analytics fetched successfully"))
  } catch (error) {
    next(error)
  }
}

// Get product category analytics
export const getProductCategoryAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get sales by category
    const categoryData = await Order.aggregate([
      {
        $match: {
          status: { $ne: "cancelled" },
        },
      },
      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $unwind: "$productInfo",
      },
      {
        $lookup: {
          from: "categories",
          localField: "productInfo.category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: "$categoryInfo",
      },
      {
        $group: {
          _id: "$categoryInfo.name",
          value: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: 1,
        },
      },
    ])

    res.status(200).json(new ApiResponse(200, { categoryData }, "Product category analytics fetched successfully"))
  } catch (error) {
    next(error)
  }
}

// Get order trends
export const getOrderTrends = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { period = "daily" } = req.query

    let dateFormat: string
    let limit: number

    // Set date format and limit based on period
    switch (period) {
      case "daily":
        dateFormat = "%Y-%m-%d"
        limit = 7 // Last 7 days
        break
      case "weekly":
        dateFormat = "%Y-W%U" // Year-Week format
        limit = 4 // Last 4 weeks
        break
      case "monthly":
      default:
        dateFormat = "%Y-%m"
        limit = 7 // Last 7 months
        break
    }

    // Get order trends
    const orderTrends = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $limit: limit,
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          orders: 1,
        },
      },
    ])

    res.status(200).json(new ApiResponse(200, { orderTrends }, "Order trends fetched successfully"))
  } catch (error) {
    next(error)
  }
}

// Get payment method analytics
export const getPaymentMethodAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get payment method distribution
    const paymentMethods = await Order.aggregate([
      {
        $match: {
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: "$paymentMethod",
          value: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", "cash"] }, then: "Cash on Delivery" },
                { case: { $eq: ["$_id", "online"] }, then: "Online Payment" },
                { case: { $eq: ["$_id", "manual"] }, then: "Manual Payment" },
              ],
              default: "$_id",
            },
          },
          value: 1,
        },
      },
    ])

    res.status(200).json(new ApiResponse(200, { paymentMethods }, "Payment method analytics fetched successfully"))
  } catch (error) {
    next(error)
  }
}

// Get top products
export const getTopProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = 5 } = req.query

    // Get top products by order count and revenue
    const topProducts = await Order.aggregate([
      {
        $match: {
          status: { $ne: "cancelled" },
        },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.product",
          orders: { $sum: 1 },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $unwind: "$productInfo",
      },
      {
        $sort: { orders: -1 },
      },
      {
        $limit: Number(limit),
      },
      {
        $project: {
          _id: 0,
          name: "$productInfo.name",
          orders: 1,
          revenue: 1,
        },
      },
    ])

    res.status(200).json(new ApiResponse(200, { topProducts }, "Top products fetched successfully"))
  } catch (error) {
    next(error)
  }
}

// Get customer acquisition data
export const getCustomerAcquisition = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get new vs returning customers by month
    const customerData = await Order.aggregate([
      {
        $group: {
          _id: {
            month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            customer: "$customer",
          },
          firstOrder: { $min: "$createdAt" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          uniqueCustomers: { $sum: 1 },
          newCustomers: {
            $sum: {
              $cond: [{ $eq: [{ $dateToString: { format: "%Y-%m", date: "$firstOrder" } }, "$_id.month"] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $limit: 7,
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          newCustomers: 1,
          returningCustomers: { $subtract: ["$uniqueCustomers", "$newCustomers"] },
        },
      },
    ])

    res.status(200).json(new ApiResponse(200, { customerData }, "Customer acquisition data fetched successfully"))
  } catch (error) {
    next(error)
  }
}

// Get dashboard analytics
export const getDashboardAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
    const orderCount = revenueData.length > 0 ? revenueData[0].orderCount : 0

    // Get active customers count
    const activeCustomers = await User.countDocuments({
      role: "customer",
      isActive: true,
    })

    // Get total reward points issued
    const rewardPointsData = await Order.aggregate([
      {
        $match: {
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: null,
          totalPoints: { $sum: "$rewardPointsEarned" },
        },
      },
    ])

    const rewardPoints = rewardPointsData.length > 0 ? rewardPointsData[0].totalPoints : 0

    // Get monthly growth rates
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    const lastMonth = new Date(currentMonth)
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    // Current month revenue
    const currentMonthData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: currentMonth },
          status: { $ne: "cancelled" },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
    ])

    // Last month revenue
    const lastMonthData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonth, $lt: currentMonth },
          status: { $ne: "cancelled" },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
    ])

    const currentMonthRevenue = currentMonthData.length > 0 ? currentMonthData[0].revenue : 0
    const lastMonthRevenue = lastMonthData.length > 0 ? lastMonthData[0].revenue : 0

    const currentMonthOrders = currentMonthData.length > 0 ? currentMonthData[0].orders : 0
    const lastMonthOrders = lastMonthData.length > 0 ? lastMonthData[0].orders : 0

    // Calculate growth rates
    const revenueGrowth =
      lastMonthRevenue === 0 ? 100 : ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100

    const orderGrowth = lastMonthOrders === 0 ? 100 : ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100

    // Get new customers this month
    const newCustomersThisMonth = await User.countDocuments({
      role: "customer",
      createdAt: { $gte: currentMonth },
    })

    // Get new customers last month
    const newCustomersLastMonth = await User.countDocuments({
      role: "customer",
      createdAt: { $gte: lastMonth, $lt: currentMonth },
    })

    const customerGrowth =
      newCustomersLastMonth === 0
        ? 100
        : ((newCustomersThisMonth - newCustomersLastMonth) / newCustomersLastMonth) * 100

    // Get reward points growth
    const rewardPointsThisMonth = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: currentMonth },
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: null,
          points: { $sum: "$rewardPointsEarned" },
        },
      },
    ])

    const rewardPointsLastMonth = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonth, $lt: currentMonth },
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: null,
          points: { $sum: "$rewardPointsEarned" },
        },
      },
    ])

    const pointsThisMonth = rewardPointsThisMonth.length > 0 ? rewardPointsThisMonth[0].points : 0
    const pointsLastMonth = rewardPointsLastMonth.length > 0 ? rewardPointsLastMonth[0].points : 0

    const pointsGrowth = pointsLastMonth === 0 ? 100 : ((pointsThisMonth - pointsLastMonth) / pointsLastMonth) * 100

    res.status(200).json(
      new ApiResponse(
        200,
        {
          stats: {
            revenue,
            orderCount,
            activeCustomers,
            rewardPoints,
            growth: {
              revenue: revenueGrowth.toFixed(1),
              orders: orderGrowth.toFixed(1),
              customers: customerGrowth.toFixed(1),
              rewardPoints: pointsGrowth.toFixed(1),
            },
          },
        },
        "Dashboard analytics fetched successfully",
      ),
    )
  } catch (error) {
    next(error)
  }
}
