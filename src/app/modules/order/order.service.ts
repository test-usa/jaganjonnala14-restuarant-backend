/* eslint-disable @typescript-eslint/no-explicit-any */
import { orderModel } from "./order.model";
import status from "http-status";
import AppError from "../../errors/AppError";

export const orderService = {
  async create(data: any) {
    try {
      return await orderModel.create(data);
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
      // Default values with proper parsing
      const pageSize = parseInt(query.pageSize) || 10;
      const pageIndex = parseInt(query.pageIndex) || 0; // Fixed: pageIndex should start from 0
      const searchTerm = query.searchTerm || '';
      
      // Build filter object - start with empty if no conditions
      const filter: any = {};
      
  
      // Add search term filter if provided
      if (searchTerm) {
        filter.$or = [
          { transactionId: { $regex: searchTerm, $options: 'i' } },
          // Add other searchable fields as needed
          // { customerName: { $regex: searchTerm, $options: 'i' } },
          // { orderNumber: { $regex: searchTerm, $options: 'i' } },
        ];
      }
  
      // Calculate pagination - fixed formula
      const skip = pageIndex * pageSize;
      
      // Get total count for metadata
      const total = await orderModel.countDocuments(filter);
  
      // Build query with sorting, pagination
      const dbQuery = orderModel.find(filter).populate({
        path: 'items.product',
        select: 'productName skuCode',
        model: 'product'
      })
        .skip(skip)
        .limit(pageSize).sort({ createdAt: -1})
  
 
  
      // Execute query
      const result = await dbQuery.exec();
  
      // Return result with metadata
      return {
        result,
        meta: {
          total,
          pageSize,
          pageIndex,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch orders: ${error.message}`);
      }
      throw new Error('An unknown error occurred while fetching orders.');
    }
  },
  async getById(id: string) {
    try {
      return await orderModel.findById(id);
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
      // const isDeleted = await orderModel.findOne({ _id: data.id });
      //   if (isDeleted?.isDelete) {
      //     throw new AppError(status.NOT_FOUND, "order is already deleted");
      //   }

      const result = await orderModel.updateOne({ _id: data.id }, data, {
        new: true,
      });
      if (!result) {
        throw new Error("order not found.");
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
      // Step 1: Check if the order exists in the database
      const isExist = await orderModel.findOne({ _id: id });

      if (!isExist) {
        throw new AppError(status.NOT_FOUND, "order not found");
      }

      // Step 4: Delete the home order from the database
      await orderModel.updateOne({ _id: id }, { isDelete: true });
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

      // Step 1: Check if the order exist in the database
      const existingorder = await orderModel.find({ _id: { $in: ids } });

      if (existingorder.length === 0) {
        throw new AppError(
          status.NOT_FOUND,
          "No order found with the given IDs"
        );
      }

      // Step 2: Perform soft delete by updating isDelete field to true
      await orderModel.updateMany({ _id: { $in: ids } }, { isDelete: true });

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
