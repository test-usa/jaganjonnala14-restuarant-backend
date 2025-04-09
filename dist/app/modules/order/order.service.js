"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const order_model_1 = require("./order.model");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
exports.orderService = {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield order_model_1.orderModel.create(data);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`${error.message}`);
                }
                else {
                    throw new Error("An unknown error occurred while fetching by ID.");
                }
            }
        });
    },
    getAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Default values with proper parsing
                const pageSize = parseInt(query.pageSize) || 10;
                const pageIndex = parseInt(query.pageIndex) || 0; // Fixed: pageIndex should start from 0
                const searchTerm = query.searchTerm || '';
                // Build filter object - start with empty if no conditions
                const filter = {};
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
                const total = yield order_model_1.orderModel.countDocuments(filter);
                // Build query with sorting, pagination
                const dbQuery = order_model_1.orderModel.find(filter).populate({
                    path: 'items.product',
                    select: 'productName skuCode',
                    model: 'product'
                })
                    .skip(skip)
                    .limit(pageSize).sort({ createdAt: -1 });
                // Execute query
                const result = yield dbQuery.exec();
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
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Failed to fetch orders: ${error.message}`);
                }
                throw new Error('An unknown error occurred while fetching orders.');
            }
        });
    },
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield order_model_1.orderModel.findById(id);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`${error.message}`);
                }
                else {
                    throw new Error("An unknown error occurred while fetching by ID.");
                }
            }
        });
    },
    update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const isDeleted = await orderModel.findOne({ _id: data.id });
                //   if (isDeleted?.isDelete) {
                //     throw new AppError(status.NOT_FOUND, "order is already deleted");
                //   }
                const result = yield order_model_1.orderModel.updateOne({ _id: data.id }, data, {
                    new: true,
                });
                if (!result) {
                    throw new Error("order not found.");
                }
                return result;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`${error.message}`);
                }
                else {
                    throw new Error("An unknown error occurred while fetching by ID.");
                }
            }
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Step 1: Check if the order exists in the database
                const isExist = yield order_model_1.orderModel.findOne({ _id: id });
                if (!isExist) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "order not found");
                }
                // Step 4: Delete the home order from the database
                yield order_model_1.orderModel.updateOne({ _id: id }, { isDelete: true });
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`${error.message}`);
                }
                else {
                    throw new Error("An unknown error occurred while fetching by ID.");
                }
            }
        });
    },
    bulkDelete(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!ids || !Array.isArray(ids) || ids.length === 0) {
                    throw new Error("Invalid IDs provided");
                }
                // Step 1: Check if the order exist in the database
                const existingorder = yield order_model_1.orderModel.find({ _id: { $in: ids } });
                if (existingorder.length === 0) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No order found with the given IDs");
                }
                // Step 2: Perform soft delete by updating isDelete field to true
                yield order_model_1.orderModel.updateMany({ _id: { $in: ids } }, { isDelete: true });
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`${error.message}`);
                }
                else {
                    throw new Error("An unknown error occurred while fetching by ID.");
                }
            }
        });
    },
};
