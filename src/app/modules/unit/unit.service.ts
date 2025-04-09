/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import { UNIT_SEARCHABLE_FIELDS } from "./unit.constant";
import { unitModel } from "./unit.model";
import AppError from "../../errors/AppError";

export const unitService = {
  async create(data: any) {
    return await unitModel.create(data);
  },
  async getAll(query: any) {
    try {
      const service_query = new QueryBuilder(unitModel.find(), query)
        .search(UNIT_SEARCHABLE_FIELDS)
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
      return await unitModel.findById(id);
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
      return await unitModel.findByIdAndUpdate(id, data, { new: true });
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
      const isExist = await unitModel.findOne({ _id: id });

      if (!isExist) {
        throw new AppError(status.NOT_FOUND, "unit not found");
      }

      // Step 4: Delete the  from the database
      await unitModel.updateOne({ _id: id }, { isDelete: true });
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

      // Step 1: Check if the units exist in the database
      const existingData = await unitModel.find({ _id: { $in: ids } });

      if (existingData.length === 0) {
        throw new AppError(
          status.NOT_FOUND,
          "No units found with the given IDs"
        );
      }

      // Step 2: Perform soft delete by updating `isDelete` field to `true`
      await unitModel.updateMany({ _id: { $in: ids } }, { isDelete: true });

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
