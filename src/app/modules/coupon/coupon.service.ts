/* eslint-disable @typescript-eslint/no-explicit-any */
import { couponModel } from "./coupon.model";
import { COUPON_SEARCHABLE_FIELDS } from "./coupon.constant";
import QueryBuilder from "../../builder/QueryBuilder";
import status from "http-status";
import AppError from "../../errors/AppError";
import { Types } from "mongoose";

export const couponService = {
  async create(data: any) {
    try {
   // Validate date range
      if (new Date(data.endDate) <= new Date(data.startDate || Date.now())) {
        throw new Error('End date must be after start date');
      }

      // Additional validation for percentage discounts
      if (data.discountType === 'percentage' && !data.maxDiscountAmount) {
        throw new Error(
          'Maximum discount amount is required for percentage discounts', 
        );
      }

      const coupon = await couponModel.create(data);
      return coupon;    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async couponApply(data: any, userId: string) {
    try {
      const { code, cartTotal } = data;

      // find coupon
      const coupon = await couponModel.findOne({
        code,
        isActive: true,
        startDate: { $lte: Date.now() },
        endDate: { $gte: Date.now() },
      });
      if (!coupon) {
        throw new AppError(status.NOT_FOUND, "Invalid or expired coupon");
      }

      // useage limit check
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        throw new AppError(status.FORBIDDEN, "Coupon usage limit reached");
      }

      // check if user has already used the coupon
      if (coupon.usersUsed.includes(new Types.ObjectId(userId))) {
        throw new AppError(status.FORBIDDEN, "Coupon already used");
      }

      if (cartTotal < coupon.minOrderAmount) {
        throw new AppError(
          status.FORBIDDEN,
          "Minimum order amount should be at least " + coupon.minOrderAmount
        );
      }

      // discount calculated
      let discountAmount;
      if (coupon.discountType === "percentage") {
        discountAmount = (cartTotal * coupon.discountValue) / 100;
        if (
          coupon.maxDiscountAmount &&
          discountAmount > coupon.maxDiscountAmount
        ) {
          discountAmount = coupon.maxDiscountAmount;
        }
      } else {
        discountAmount = coupon.discountValue;
      }

      const result = {
        discountAmount,
        finalAmount: cartTotal - discountAmount,
        coupon: {
          id: coupon._id,
          code: coupon.code,
          name: coupon.name,
          discountType: coupon.discountType,
        },
      };

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },

  async getAll(query: any) {
    try {
      const service_query = new QueryBuilder(couponModel.find(), query)
        .search(COUPON_SEARCHABLE_FIELDS)
        .filter()
        .sort()
        .paginate()
        .fields();

      const result = await service_query.modelQuery;
      const meta = await service_query.countTotal();
      return {
        result,
        meta,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async getById(id: string) {
    try {
      return await couponModel.findById(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async update(data: any, id: string) {
    try {
      const isDeleted = await couponModel.findOne({ _id: id });
      if (isDeleted?.isDelete) {
        throw new AppError(status.NOT_FOUND, "coupon is already deleted");
      }

      const result = await couponModel.updateOne({ _id: id }, data, {
        new: true,
      });
      if (!result) {
        throw new Error("coupon not found.");
      }
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async delete(id: string) {
    try {
      // Step 1: Check if the coupon exists in the database
      const isExist = await couponModel.findOne({ _id: id });

      if (!isExist) {
        throw new AppError(status.NOT_FOUND, "coupon not found");
      }

      // Step 4: Delete the home coupon from the database
      await couponModel.updateOne({ _id: id }, { isDelete: true });
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },

};
