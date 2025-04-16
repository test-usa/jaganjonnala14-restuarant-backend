import { expenseModel } from "./expense.model";
  import { EXPENSE_SEARCHABLE_FIELDS } from "./expense.constant";
import QueryBuilder from "../../builder/QueryBuilder";
import status from "http-status";
import AppError from "../../errors/AppError";


export const expenseService = {
  async create(data: any) {
  try {
    return await expenseModel.create(data);
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


  const service_query = new QueryBuilder(expenseModel.find(), query)
        .search(EXPENSE_SEARCHABLE_FIELDS)
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
    return await expenseModel.findById(id);
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



  const isDeleted = await expenseModel.findOne({ _id: data.id });
    if (isDeleted?.isDelete) {
      throw new AppError(status.NOT_FOUND, "expense is already deleted");
    }

    const result = await expenseModel.updateOne({ _id: data.id }, data, {
      new: true,
    });
    if (!result) {
      throw new Error("expense not found.");
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


 // Step 1: Check if the expense exists in the database
    const isExist = await expenseModel.findOne({ _id: id });

    if (!isExist) {
      throw new AppError(status.NOT_FOUND, "expense not found");
    }

    // Step 4: Delete the home expense from the database
    await expenseModel.updateOne({ _id: id }, { isDelete: true });
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

      // Step 1: Check if the expense exist in the database
      const existingexpense = await expenseModel.find({ _id: { $in: ids } });

      if (existingexpense.length === 0) {
        throw new AppError(
          status.NOT_FOUND,
          "No expense found with the given IDs"
        );
      }

      // Step 2: Perform soft delete by updating isDelete field to true
      await expenseModel.updateMany({ _id: { $in: ids } }, { isDelete: true });

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