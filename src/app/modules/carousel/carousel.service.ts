/* eslint-disable @typescript-eslint/no-explicit-any */
import { carouselModel } from "./carousel.model";

import config from "../../config";

export const carouselService = {
  async create(data: any) {
    try {
      return await carouselModel.create(data);
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

      // Calculate pagination - fixed formula
      const skip = pageIndex * pageSize;

      // Get total count for metadata
      const total = await carouselModel.countDocuments();

      // Build query with sorting, pagination
      let dbQuery = carouselModel.find().skip(skip).limit(pageSize);

      // Add sorting if provided
      if (query.sortBy) {
        const sortOrder = query.sortOrder === "desc" ? -1 : 1;
        dbQuery = dbQuery.sort({ [query.sortBy]: sortOrder });
      }

      // Execute query
      let result = await dbQuery.exec();

      result = result?.map((item: any) => {
        return {
          ...item.toObject(),
          image: `${config.base_url}/${item.image?.replace(/\\/g, "/")}`,
        };
      });

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
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },

  async delete(id: string) {
    try {
      // Step 1: Check if the carousel exists in the database
      await carouselModel.deleteOne({ _id: id });
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
