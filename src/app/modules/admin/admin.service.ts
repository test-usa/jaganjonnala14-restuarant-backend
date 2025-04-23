import { adminModel } from "./admin.model";
import { ADMIN_SEARCHABLE_FIELDS } from "./admin.constant";
import QueryBuilder from "../../builder/QueryBuilder";
import status from "http-status";
import AppError from "../../errors/AppError";
import { usersModel } from "../users/users.model";

export const adminService = {
  async postAdminIntoDB(data: any) {
    try {
      return await adminModel.create(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async getAllAdminFromDB(query: any) {
    try {
      const service_query = new QueryBuilder(adminModel.find(), query)
        .search(ADMIN_SEARCHABLE_FIELDS)
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
  async getSingleAdminFromDB(id: string) {
    try {
      return await adminModel.findById(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async updateAdminIntoDB(data: any) {
    try {
      const isDeleted = await adminModel.findOne({ _id: data.id });
      if (isDeleted?.isDelete) {
        throw new AppError(status.NOT_FOUND, "admin is already deleted");
      }

      const result = await adminModel.updateOne({ _id: data.id }, data, {
        new: true,
      });
      if (!result) {
        throw new Error("admin not found.");
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
  async deleteAdminFromDB(id: string) {
    try {
      // Step 1: Check if the admin exists in the database
      const isExist = await adminModel.findOne({ _id: id });

      if (!isExist) {
        throw new AppError(status.NOT_FOUND, "admin not found");
      }

      // Step 4: Delete the home admin from the database
      await adminModel.updateOne({ _id: id }, { isDelete: true });
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },

  async createManagerIntoDB(data: Record<string, any>) {
    try {
      // Step 1: Check if the manager exists in the database
      const isExistManager = await usersModel.findOne({
        $or: [
          {
            email: data.email,
          },
          {
            phone: data.phone,
          },
        ],
      });

      if (isExistManager) {
        throw new AppError(status.CONFLICT, "Manager already exists");
      }
      // Step 2: check if the manager is inactive
      const isInactiveManager = await usersModel.findOne({
        $or: [
          {
            email: data.email,
          },
          {
            phone: data.phone,
          },
        ],
        isActive: false,
      });

      if (isInactiveManager) {
        throw new AppError(
          status.CONFLICT,
          "Manager is already have an account but inactive"
        );
      }

      // Step 3: Create the manager in the database
      const newManager = await usersModel.create({...data, role: "manager" });

      return newManager;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
};
