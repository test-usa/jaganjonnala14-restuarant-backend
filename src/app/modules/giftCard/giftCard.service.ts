/* eslint-disable @typescript-eslint/no-explicit-any */
import {  giftCardModel } from "./giftCard.model";
import { GIFTCARD_SEARCHABLE_FIELDS } from "./giftCard.constant";
import QueryBuilder from "../../builder/QueryBuilder";
import status from "http-status";
import AppError from "../../errors/AppError";

export const giftCardService = {
  async create(data: any) {
    try {
      return await giftCardModel.create(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async giftCardApply(data: any, userId: string) {
    try {
      const { code, cartTotal } = data;
      // ১. গিফট কার্ড খুঁজে বের করো
      const giftCard = await giftCardModel.findOne({
        code,
        isActive: true,
        expiryDate: { $gte: Date.now() },
        remainingAmount: { $gt: 0 },
      });

      if (!giftCard) {
        throw new Error("Invalid or expired gift card");
      }

      // ২. রিডিম্পশন হিস্ট্রি চেক করো
      const alreadyRedeemed = giftCard.redeemedBy.some(
        (redemption) => redemption.user?.toString() === userId
      );

      if (alreadyRedeemed && !giftCard.allowMultipleUse) {
        throw new Error("This gift card has already been used");
      }

      // ৩. অ্যাপ্লাই করা যায় এমন অ্যামাউন্ট ক্যালকুলেট করো
      const applicableAmount = Math.min(giftCard.remainingAmount, cartTotal);

      // ৪. রেসপন্স পাঠাও
      const result = {
        appliedAmount: applicableAmount,
        finalAmount: cartTotal - applicableAmount,
        remainingBalance: giftCard.remainingAmount - applicableAmount,
        giftCard: {
          id: giftCard._id,
          code: giftCard.code,
          originalAmount: giftCard.amount,
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
      const service_query = new QueryBuilder(giftCardModel.find(), query)
        .search(GIFTCARD_SEARCHABLE_FIELDS)
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
      return await giftCardModel.findById(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async update(data: any) {
    try {
      // const isDeleted = await giftCardModel.findOne({ _id: data.id });
      // if (isDeleted?.isDelete) {
      //   throw new AppError(status.NOT_FOUND, "giftCard is already deleted");
      // }

      const result = await giftCardModel.updateOne({ _id: data.id }, data, {
        new: true,
      });
      if (!result) {
        throw new Error("giftCard not found.");
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
      // Step 1: Check if the giftCard exists in the database
      const isExist = await giftCardModel.findOne({ _id: id });

      if (!isExist) {
        throw new AppError(status.NOT_FOUND, "giftCard not found");
      }

      // Step 4: Delete the home giftCard from the database
      await giftCardModel.updateOne({ _id: id }, { isDelete: true });
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async bulkDelete(ids: string[]) {
    try {
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new Error("Invalid IDs provided");
      }

      // Step 1: Check if the giftCard exist in the database
      const existinggiftCard = await giftCardModel.find({ _id: { $in: ids } });

      if (existinggiftCard.length === 0) {
        throw new AppError(
          status.NOT_FOUND,
          "No giftCard found with the given IDs"
        );
      }

      // Step 2: Perform soft delete by updating isDelete field to true
      await giftCardModel.updateMany({ _id: { $in: ids } }, { isDelete: true });

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
