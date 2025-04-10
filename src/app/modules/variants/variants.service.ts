/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import { variants_SEARCHABLE_FIELDS } from "./variants.constant";
import { variantsModel } from "./variants.model";
import AppError from "../../errors/AppError";

export const variantsService = {
  async create(data: any) {
    return await variantsModel.create(data);
  },
  async getAll(query: any) {
    try {
      const service_query = new QueryBuilder(variantsModel.find(), query)
        .search(variants_SEARCHABLE_FIELDS)
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
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred.");
      }
    }
  },
  async getById(id: string) {
    try {
      return await variantsModel.findById(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred.");
      }
    }
  },
  async update(id: string, data: any) {
    try {
      return await variantsModel.findByIdAndUpdate(id, data, { new: true });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred.");
      }
    }
  },
  async delete(id: string) {
    try {
      // Step 1: Check if the banner exists in the database
      const isExist = await variantsModel.findOne({ _id: id });

      if (!isExist) {
        throw new AppError(status.NOT_FOUND, "variants not found");
      }

      // Step 4: Delete the  from the database
      await variantsModel.updateOne({ _id: id }, { isDelete: true });
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred.");
      }
    }
  },
  async bulkDelete(ids: string[]) {

  
    try {
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new Error("Invalid IDs provided");
      }

      // Step 1: Check if the variantss exist in the database
      const existingData = await variantsModel.find({ _id: { $in: ids } });

      if (existingData.length === 0) {
        throw new AppError(
          status.NOT_FOUND,
          "No variantss found with the given IDs"
        );
      }

      // Step 2: Perform soft delete by updating `isDelete` field to `true`
      await variantsModel.updateMany({ _id: { $in: ids } }, { isDelete: true });

      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred.");
      }
    }
  },
};
