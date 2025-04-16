import { balanceModel } from "./balance.model";
  import { BALANCE_SEARCHABLE_FIELDS } from "./balance.constant";
import QueryBuilder from "../../builder/QueryBuilder";
import status from "http-status";
import AppError from "../../errors/AppError";


export const balanceService = {
  async create(data: any) {
  try {
    return await balanceModel.create(data);
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


  const service_query = new QueryBuilder(balanceModel.find(), query)
        .search(BALANCE_SEARCHABLE_FIELDS)
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
    return await balanceModel.findById(id);
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



  const isDeleted = await balanceModel.findOne({ _id: data.id });
    if (isDeleted?.isDelete) {
      throw new AppError(status.NOT_FOUND, "balance is already deleted");
    }

    const result = await balanceModel.updateOne({ _id: data.id }, data, {
      new: true,
    });
    if (!result) {
      throw new Error("balance not found.");
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


 // Step 1: Check if the balance exists in the database
    const isExist = await balanceModel.findOne({ _id: id });

    if (!isExist) {
      throw new AppError(status.NOT_FOUND, "balance not found");
    }

    // Step 4: Delete the home balance from the database
    await balanceModel.updateOne({ _id: id }, { isDelete: true });
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

      // Step 1: Check if the balance exist in the database
      const existingbalance = await balanceModel.find({ _id: { $in: ids } });

      if (existingbalance.length === 0) {
        throw new AppError(
          status.NOT_FOUND,
          "No balance found with the given IDs"
        );
      }

      // Step 2: Perform soft delete by updating isDelete field to true
      await balanceModel.updateMany({ _id: { $in: ids } }, { isDelete: true });

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