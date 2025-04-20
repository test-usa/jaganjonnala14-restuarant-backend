import type { Request, Response, NextFunction } from "express"
import { Settings } from "../models/settings.model"
import { ApiResponse } from "../utils/ApiResponse"

// Get settings
export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let settings = await Settings.findOne()

    // Create default settings if none exist
    if (!settings) {
      settings = await Settings.create({})
    }

    res.status(200).json(new ApiResponse(200, { settings }, "Settings fetched successfully"))
  } catch (error) {
    next(error)
  }
}

// Update settings
export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      restaurantName,
      logo,
      primaryColor,
      contactEmail,
      contactPhone,
      address,
      taxRate,
      deliveryFee,
      rewardsEnabled,
      pointsPerDollar,
      minRedemptionPoints,
      pointsValueInCents,
      leaderboardEnabled,
      leaderboardReset,
      topCustomersCount,
    } = req.body

    let settings = await Settings.findOne()

    // Create settings if none exist
    if (!settings) {
      settings = await Settings.create({
        restaurantName,
        logo,
        primaryColor,
        contactEmail,
        contactPhone,
        address,
        taxRate,
        deliveryFee,
        rewardsEnabled,
        pointsPerDollar,
        minRedemptionPoints,
        pointsValueInCents,
        leaderboardEnabled,
        leaderboardReset,
        topCustomersCount,
      })
    } else {
      // Update existing settings
      settings = await Settings.findOneAndUpdate(
        {},
        {
          restaurantName,
          logo,
          primaryColor,
          contactEmail,
          contactPhone,
          address,
          taxRate,
          deliveryFee,
          rewardsEnabled,
          pointsPerDollar,
          minRedemptionPoints,
          pointsValueInCents,
          leaderboardEnabled,
          leaderboardReset,
          topCustomersCount,
        },
        { new: true, runValidators: true },
      )
    }

    res.status(200).json(new ApiResponse(200, { settings }, "Settings updated successfully"))
  } catch (error) {
    next(error)
  }
}

// Update reward settings
export const updateRewardSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      rewardsEnabled,
      pointsPerDollar,
      minRedemptionPoints,
      pointsValueInCents,
      leaderboardEnabled,
      leaderboardReset,
      topCustomersCount,
    } = req.body

    let settings = await Settings.findOne()

    // Create settings if none exist
    if (!settings) {
      settings = await Settings.create({
        rewardsEnabled,
        pointsPerDollar,
        minRedemptionPoints,
        pointsValueInCents,
        leaderboardEnabled,
        leaderboardReset,
        topCustomersCount,
      })
    } else {
      // Update existing settings
      settings = await Settings.findOneAndUpdate(
        {},
        {
          rewardsEnabled,
          pointsPerDollar,
          minRedemptionPoints,
          pointsValueInCents,
          leaderboardEnabled,
          leaderboardReset,
          topCustomersCount,
        },
        { new: true, runValidators: true },
      )
    }

    res.status(200).json(new ApiResponse(200, { settings }, "Reward settings updated successfully"))
  } catch (error) {
    next(error)
  }
}
