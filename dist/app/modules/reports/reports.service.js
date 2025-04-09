"use strict";
// import { reportsModel } from "./reports.model";
//   import { REPORTS_SEARCHABLE_FIELDS } from "./reports.constant";
// import QueryBuilder from "../../builder/QueryBuilder";
// import status from "http-status";
// import AppError from "../../errors/AppError";
// export const reportsService = {
//   async create(data: any) {
//   try {
//     return await reportsModel.create(data);
//      } catch (error: unknown) {
//       if (error instanceof Error) {
//         throw new Error(`${error.message}`);
//       } else {
//         throw new Error("An unknown error occurred while fetching by ID.");
//       }
//     }
//   },
//   async getAll(query: any) {
//   try {
//   const service_query = new QueryBuilder(reportsModel.find(), query)
//         .search(REPORTS_SEARCHABLE_FIELDS)
//         .filter()
//         .sort()
//         .paginate()
//         .fields();
//       const result = await service_query.modelQuery;
//       const meta = await service_query.countTotal();
//       return {
//         result,
//         meta,
//       };
//      } catch (error: unknown) {
//       if (error instanceof Error) {
//         throw new Error(`${error.message}`);
//       } else {
//         throw new Error("An unknown error occurred while fetching by ID.");
//       }
//     }
//   },
//   async getById(id: string) {
//     try {
//     return await reportsModel.findById(id);
//      } catch (error: unknown) {
//       if (error instanceof Error) {
//         throw new Error(`${error.message}`);
//       } else {
//         throw new Error("An unknown error occurred while fetching by ID.");
//       }
//     }
//   },
//   async update(data: any) {
//   try {
//   const isDeleted = await reportsModel.findOne({ _id: data.id });
//     if (isDeleted?.isDelete) {
//       throw new AppError(status.NOT_FOUND, "reports is already deleted");
//     }
//     const result = await reportsModel.updateOne({ _id: data.id }, data, {
//       new: true,
//     });
//     if (!result) {
//       throw new Error("reports not found.");
//     }
//     return result;
//      } catch (error: unknown) {
//       if (error instanceof Error) {
//         throw new Error(`${error.message}`);
//       } else {
//         throw new Error("An unknown error occurred while fetching by ID.");
//       }
//     }
//   },
//   async delete(id: string) {
//     try {
//  // Step 1: Check if the reports exists in the database
//     const isExist = await reportsModel.findOne({ _id: id });
//     if (!isExist) {
//       throw new AppError(status.NOT_FOUND, "reports not found");
//     }
//     // Step 4: Delete the home reports from the database
//     await reportsModel.updateOne({ _id: id }, { isDelete: true });
//     return;
//      } catch (error: unknown) {
//       if (error instanceof Error) {
//         throw new Error(`${error.message}`);
//       } else {
//         throw new Error("An unknown error occurred while fetching by ID.");
//       }
//     }
//   },
//   async bulkDelete(ids: string[]) {
//   try {
//  if (!ids || !Array.isArray(ids) || ids.length === 0) {
//         throw new Error("Invalid IDs provided");
//       }
//       // Step 1: Check if the reports exist in the database
//       const existingreports = await reportsModel.find({ _id: { $in: ids } });
//       if (existingreports.length === 0) {
//         throw new AppError(
//           status.NOT_FOUND,
//           "No reports found with the given IDs"
//         );
//       }
//       // Step 2: Perform soft delete by updating isDelete field to true
//       await reportsModel.updateMany({ _id: { $in: ids } }, { isDelete: true });
//       return;
//      } catch (error: unknown) {
//       if (error instanceof Error) {
//         throw new Error(`${error.message}`);
//       } else {
//         throw new Error("An unknown error occurred while fetching by ID.");
//       }
//     }
//   }
// };
/* eslint-disable @typescript-eslint/no-explicit-any */
