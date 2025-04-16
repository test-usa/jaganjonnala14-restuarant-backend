import { accountModel } from "./account.model";
  import { ACCOUNT_SEARCHABLE_FIELDS } from "./account.constant";
import QueryBuilder from "../../builder/QueryBuilder";
import status from "http-status";
import AppError from "../../errors/AppError";


export const accountService = {
  async create(data: any) {
  try {
    return await accountModel.create(data);
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


  const service_query = new QueryBuilder(accountModel.find(), query)
        .search(ACCOUNT_SEARCHABLE_FIELDS)
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
    return await accountModel.findById(id);
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



  const isDeleted = await accountModel.findOne({ _id: data.id });
    if (isDeleted?.isDelete) {
      throw new AppError(status.NOT_FOUND, "account is already deleted");
    }

    const result = await accountModel.updateOne({ _id: data.id }, data, {
      new: true,
    });
    if (!result) {
      throw new Error("account not found.");
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


 // Step 1: Check if the account exists in the database
    const isExist = await accountModel.findOne({ _id: id });

    if (!isExist) {
      throw new AppError(status.NOT_FOUND, "account not found");
    }

    // Step 4: Delete the home account from the database
    await accountModel.updateOne({ _id: id }, { isDelete: true });
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

      // Step 1: Check if the account exist in the database
      const existingaccount = await accountModel.find({ _id: { $in: ids } });

      if (existingaccount.length === 0) {
        throw new AppError(
          status.NOT_FOUND,
          "No account found with the given IDs"
        );
      }

      // Step 2: Perform soft delete by updating isDelete field to true
      await accountModel.updateMany({ _id: { $in: ids } }, { isDelete: true });

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