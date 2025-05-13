import { staffModel } from "./staff.model";
import { STAFF_SEARCHABLE_FIELDS } from "./staff.constant";
import QueryBuilder from "../../../builder/QueryBuilder";
import status from "http-status";
import AppError from "../../../errors/AppError";

export const staffService = {
  async postStaffIntoDB(data: any) {
    try {
      return await staffModel.create(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async getAllStaffFromDB(query: any) {
    try {
      const service_query = new QueryBuilder(staffModel.find(), query)
        .search(STAFF_SEARCHABLE_FIELDS)
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
  async getSingleStaffFromDB(id: string) {
    try {
      return await staffModel.findById(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async updateStaffIntoDB(data: any) {
    try {
      const isDeleted = await staffModel.findOne({ _id: data.id });
      if (isDeleted?.isDelete) {
        throw new AppError(status.NOT_FOUND, "staff is already deleted");
      }

      const result = await staffModel.updateOne({ _id: data.id }, data, {
        new: true,
      });
      if (!result) {
        throw new Error("staff not found.");
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
  async deleteStaffFromDB(id: string) {
    try {
      // Step 1: Check if the staff exists in the database
      const isExist = await staffModel.findOne({ _id: id });

      if (!isExist) {
        throw new AppError(status.NOT_FOUND, "staff not found");
      }

      // Step 4: Delete the home staff from the database
      await staffModel.updateOne({ _id: id }, { isDelete: true });
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
