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
exports.usersService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const users_model_1 = require("./users.model");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../../config"));
exports.usersService = {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield users_model_1.usersModel.findOne({ phone: data.phone });
                if (user)
                    throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already exists");
                user = new users_model_1.usersModel({ phone: data.phone });
                yield user.save();
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(` ${error.message}`);
                }
                else {
                    throw new Error("An unknown error occurred while fetching by ID.");
                }
            }
        });
    },
    adminRegistration(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, phone, password } = data;
                // Check if the admin already exists
                const existingAdmin = yield users_model_1.usersModel.findOne({
                    $or: [{ email }, { phone }],
                });
                if (existingAdmin) {
                    throw new Error(`Admin already exists, please login.`);
                }
                // Hash password
                const hashedPassword = yield bcryptjs_1.default.hash(password, config_1.default.SALT);
                // Create new admin
                yield users_model_1.usersModel.create({
                    email,
                    phone,
                    password: hashedPassword,
                });
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(` ${error.message}`);
                }
                else {
                    throw new Error("An unknown error occurred while fetching by ID.");
                }
            }
        });
    },
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield users_model_1.usersModel.findOne({ phone: data.phone });
                if (!user)
                    throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User not found please register");
                return user;
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
    adminLogin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = data;
            try {
                const user = yield users_model_1.usersModel.findOne({
                    $or: [{ email }],
                    role: "admin",
                });
                if (!user || !user.password)
                    throw new Error("Invalid credentials");
                const isMatch = yield bcryptjs_1.default.compare(password, user.password);
                if (!isMatch)
                    throw new Error("Invalid credentials");
                return user;
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
                const filter = { isDelete: false };
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
                const total = yield users_model_1.usersModel.countDocuments(filter);
                // Build query with sorting, pagination
                let dbQuery = users_model_1.usersModel.find(filter)
                    .skip(skip)
                    .limit(pageSize);
                // Add sorting if provided
                if (query.sortBy) {
                    const sortOrder = query.sortOrder === 'desc' ? -1 : 1;
                    dbQuery = dbQuery.sort({ [query.sortBy]: sortOrder });
                }
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
                return yield users_model_1.usersModel.findById(id);
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
                // const isDeleted = await usersModel.findOne({ _id: data.id });
                // if (isDeleted?.isDelete) {
                //   throw new AppError(status.NOT_FOUND, "users is already deleted");
                // }
                const result = yield users_model_1.usersModel.updateOne({ _id: data.id }, data, {
                    new: true,
                });
                if (!result) {
                    throw new Error("users not found.");
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
                // Step 1: Check if the users exists in the database
                const isExist = yield users_model_1.usersModel.findOne({ _id: id });
                if (!isExist) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "users not found");
                }
                if (isExist.isDelete) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User already Deleted");
                }
                // Step 4: Delete the home users from the database
                yield users_model_1.usersModel.updateOne({ _id: id }, { isDelete: true });
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
                // Step 1: Check if the users exist in the database
                const existingusers = yield users_model_1.usersModel.find({ _id: { $in: ids } });
                if (existingusers.length === 0) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No users found with the given IDs");
                }
                // Step 2: Perform soft delete by updating isDelete field to true
                yield users_model_1.usersModel.updateMany({ _id: { $in: ids } }, { isDelete: true });
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
