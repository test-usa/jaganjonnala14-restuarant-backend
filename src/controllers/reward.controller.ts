import type { Request, Response, NextFunction } from "express"
import { User } from "../models/user.model"
import { Order } from "../models/order.model"
import { Settings } from "../models/settings.model"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"

// Get reward settings
export const getRewardSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let settings = await Settings.findOne()

    // Create default settings if none exist
    if (!settings) {
      settings = await Settings.create({})
    }

    const rewardSettings = {
      rewardsEnabled: settings.rewardsEnabled,
      pointsPerDollar: settings.pointsPerDollar,
      minRedemptionPoints: settings.minRedemptionPoints,
      pointsValueInCents: settings.pointsValueInCents,
      leaderboardEnabled: settings.leaderboardEnabled,
      leaderboardReset: settings.leaderboardReset,
      topCustomersCount: settings.topCustomersCount,
    }

    res.status(200).json(new ApiResponse(200, { rewardSettings }, "Reward settings fetched successfully"))
  } catch (error) {
    next(error)
  }
}

// Get customer leaderboard
export const getCustomerLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await Settings.findOne()

    if (!settings || !settings.leaderboardEnabled) {
      throw new ApiError(400, "Leaderboard is disabled")
    }

    const limit = settings.topCustomersCount || 10

    // Determine date range based on leaderboard reset period
    const startDate = new Date()

    switch (settings.leaderboardReset) {
      case "monthly":
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case "quarterly":
        startDate.setMonth(startDate.getMonth() - 3)
        break
      case "yearly":
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
      default:
        startDate.setMonth(startDate.getMonth() - 1) // Default to monthly
    }

    // Get top customers based on order amount in the period
    const topCustomers = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: "$customer",
          orders: { $sum: 1 },
          spent: { $sum: "$totalAmount" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "customerInfo",
        },
      },
      {
        $unwind: "$customerInfo",
      },
      {
        $sort: { spent: -1 },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 0,
          id: "$customerInfo._id",
          name: "$customerInfo.name",
          email: "$customerInfo.email",
          phone: "$customerInfo.phone",
          orders: 1,
          spent: 1,
          rewardPoints: "$customerInfo.rewardPoints",
          rank: { $add: [{ $indexOfArray: [{ $map: { input: "$ROOT", as: "doc", in: "$$doc._id" } }, "$_id"] }, 1] },
        },
      },
    ])

    // Add rank to each customer
    const leaderboard = topCustomers.map((customer, index) => ({
      ...customer,
      rank: index + 1,
    }))

    res.status(200).json(new ApiResponse(200, { leaderboard }, "Customer leaderboard fetched successfully"))
  } catch (error) {
    next(error)
  }
}

// Add reward points to customer
export const addRewardPoints = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customerId } = req.params
    const { points, note } = req.body

    if (!points || points <= 0) {
      throw new ApiError(400, "Points must be a positive number")
    }

    // Check if customer exists
    const customer = await User.findById(customerId)
    if (!customer) {
      throw new ApiError(404, "Customer not found")
    }

    // Add points
    customer.rewardPoints += points
    await customer.save()

    // Log the points addition (in a real app, you might want to store this in a separate collection)
    console.log(`Added ${points} points to customer ${customerId}. Note: ${note || "N/A"}`)

    res
      .status(200)
      .json(new ApiResponse(200, { customer }, `${points} reward points added successfully to ${customer.name}`))
  } catch (error) {
    next(error)
  }
}

// Get customer reward points
export const getCustomerRewardPoints = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customerId = req.user._id

    const customer = await User.findById(customerId).select("rewardPoints")
    if (!customer) {
      throw new ApiError(404, "Customer not found")
    }

    // Get settings for point value
    const settings = await Settings.findOne()
    const pointsValueInCents = settings?.pointsValueInCents || 1
    const minRedemptionPoints = settings?.minRedemptionPoints || 100

    // Calculate dollar value of points
    const pointsValue = (customer.rewardPoints * pointsValueInCents) / 100

    res.status(200).json(
      new ApiResponse(
        200,
        {
          rewardPoints: customer.rewardPoints,
          pointsValue: pointsValue.toFixed(2),
          canRedeem: customer.rewardPoints >= minRedemptionPoints,
          minRedemptionPoints,
        },
        "Customer reward points fetched successfully",
      ),
    )
  } catch (error) {
    next(error)
  }
}

// Distribute monthly rewards
export const distributeMonthlyRewards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstPlacePoints = 500, secondPlacePoints = 300, thirdPlacePoints = 200 } = req.body

    // Get top 3 customers from last month
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    lastMonth.setDate(1)
    lastMonth.setHours(0, 0, 0, 0)

    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    const topCustomers = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonth, $lt: currentMonth },
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: "$customer",
          spent: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { spent: -1 },
      },
      {
        $limit: 3,
      },
    ])

    if (topCustomers.length === 0) {
      throw new ApiError(404, "No customers found for last month")
    }

    // Distribute rewards
    const rewards = []

    if (topCustomers.length >= 1) {
      const firstPlace = await User.findById(topCustomers[0]._id)
      if (firstPlace) {
        firstPlace.rewardPoints += firstPlacePoints
        await firstPlace.save()
        rewards.push({
          customer: firstPlace.name,
          position: "1st",
          points: firstPlacePoints,
        })
      }
    }

    if (topCustomers.length >= 2) {
      const secondPlace = await User.findById(topCustomers[1]._id)
      if (secondPlace) {
        secondPlace.rewardPoints += secondPlacePoints
        await secondPlace.save()
        rewards.push({
          customer: secondPlace.name,
          position: "2nd",
          points: secondPlacePoints,
        })
      }
    }

    if (topCustomers.length >= 3) {
      const thirdPlace = await User.findById(topCustomers[2]._id)
      if (thirdPlace) {
        thirdPlace.rewardPoints += thirdPlacePoints
        await thirdPlace.save()
        rewards.push({
          customer: thirdPlace.name,
          position: "3rd",
          points: thirdPlacePoints,
        })
      }
    }

    res.status(200).json(new ApiResponse(200, { rewards }, "Monthly rewards distributed successfully"))
  } catch (error) {
    next(error)
  }
}
