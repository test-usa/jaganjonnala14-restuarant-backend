import { incomeModel } from "./income.model";
  import { INCOME_SEARCHABLE_FIELDS } from "./income.constant";
import QueryBuilder from "../../builder/QueryBuilder";
import status from "http-status";
import AppError from "../../errors/AppError";


export const incomeService = {
  async create(data: any) {
  try {
    return await incomeModel.create(data);
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


  const service_query = new QueryBuilder(incomeModel.find(), query)
        .search(INCOME_SEARCHABLE_FIELDS)
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
    return await incomeModel.findById(id);
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



  const isDeleted = await incomeModel.findOne({ _id: data.id });
    if (isDeleted?.isDelete) {
      throw new AppError(status.NOT_FOUND, "income is already deleted");
    }

    const result = await incomeModel.updateOne({ _id: data.id }, data, {
      new: true,
    });
    if (!result) {
      throw new Error("income not found.");
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


 // Step 1: Check if the income exists in the database
    const isExist = await incomeModel.findOne({ _id: id });

    if (!isExist) {
      throw new AppError(status.NOT_FOUND, "income not found");
    }

    // Step 4: Delete the home income from the database
    await incomeModel.updateOne({ _id: id }, { isDelete: true });
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

      // Step 1: Check if the income exist in the database
      const existingincome = await incomeModel.find({ _id: { $in: ids } });

      if (existingincome.length === 0) {
        throw new AppError(
          status.NOT_FOUND,
          "No income found with the given IDs"
        );
      }

      // Step 2: Perform soft delete by updating isDelete field to true
      await incomeModel.updateMany({ _id: { $in: ids } }, { isDelete: true });

      return;




     } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  }
};