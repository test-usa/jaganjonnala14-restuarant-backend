/* eslint-disable @typescript-eslint/no-explicit-any */
import { usersModel } from "./users.model";

import status from "http-status";
import AppError from "../../errors/AppError";
import bcrypt from "bcryptjs";
import config from "../../config";

export const usersService = {
  async create(data: any) {
    try {
      let user = await usersModel.findOne({ phone: data.phone });

      if (user) throw new AppError(status.BAD_REQUEST, "User already exists");

      user = new usersModel({ phone: data.phone });
      await user.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(` ${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async adminRegistration(data: any) {
    try {
      const { email, phone, password } = data;

      // Check if the admin already exists
      const existingAdmin = await usersModel.findOne({
        $or: [{ email }, { phone }],
      });
      if (existingAdmin) {
        throw new Error(`Admin already exists, please login.`);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, config.SALT);

      // Create new admin
      await usersModel.create({
        email,
        phone,
        password: hashedPassword,
      });
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(` ${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async login(data: any) {
    try {
      const user = await usersModel.findOne({ phone: data.phone });

      if (!user)
        throw new AppError(
          status.BAD_REQUEST,
          "User not found please register"
        );

      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async adminLogin(data: any) {
    const {email, password } = data;

    try {
      const user = await usersModel.findOne({
        $or: [{ email }],
        role: "admin",
      });

      if (!user || !user.password) throw new Error("Invalid credentials");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");
      return user;
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
       const filter: any = { isDelete: false };

       
   
       // Add search term filter if provided
       if (searchTerm) {
        filter.$or = [
          { phone: { $regex: searchTerm, $options: 'i' } },
          { name: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } }
        ];
      }
   
       // Calculate pagination - fixed formula
       const skip = pageIndex * pageSize;
       
       // Get total count for metadata
       const total = await usersModel.countDocuments(filter);
   
       // Build query with sorting, pagination
       let dbQuery = usersModel.find(filter)
         .skip(skip)
         .limit(pageSize);
   
       // Add sorting if provided
       if (query.sortBy) {
         const sortOrder = query.sortOrder === 'desc' ? -1 : 1;
         dbQuery = dbQuery.sort({ [query.sortBy]: sortOrder });
       }
   
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
      return await usersModel.findById(id);
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
      // const isDeleted = await usersModel.findOne({ _id: data.id });
      // if (isDeleted?.isDelete) {
      //   throw new AppError(status.NOT_FOUND, "users is already deleted");
      // }

      const result = await usersModel.updateOne({ _id: data.id }, data, {
        new: true,
      });
      if (!result) {
        throw new Error("users not found.");
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
      // Step 1: Check if the users exists in the database
      const isExist = await usersModel.findOne({ _id: id });

      if (!isExist) {
        throw new AppError(status.NOT_FOUND, "users not found");
      }
      if (isExist.isDelete) {
        throw new AppError(status.NOT_FOUND, "User already Deleted");
      }

      // Step 4: Delete the home users from the database
      await usersModel.updateOne({ _id: id }, { isDelete: true });
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

      // Step 1: Check if the users exist in the database
      const existingusers = await usersModel.find({ _id: { $in: ids } });

      if (existingusers.length === 0) {
        throw new AppError(
          status.NOT_FOUND,
          "No users found with the given IDs"
        );
      }

      // Step 2: Perform soft delete by updating isDelete field to true
      await usersModel.updateMany({ _id: { $in: ids } }, { isDelete: true });

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
