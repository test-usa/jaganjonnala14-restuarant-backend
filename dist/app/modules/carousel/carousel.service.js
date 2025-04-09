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
exports.carouselService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const carousel_model_1 = require("./carousel.model");
const config_1 = __importDefault(require("../../config"));
exports.carouselService = {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield carousel_model_1.carouselModel.create(data);
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
                // Calculate pagination - fixed formula
                const skip = pageIndex * pageSize;
                // Get total count for metadata
                const total = yield carousel_model_1.carouselModel.countDocuments();
                // Build query with sorting, pagination
                let dbQuery = carousel_model_1.carouselModel.find().skip(skip).limit(pageSize);
                // Add sorting if provided
                if (query.sortBy) {
                    const sortOrder = query.sortOrder === "desc" ? -1 : 1;
                    dbQuery = dbQuery.sort({ [query.sortBy]: sortOrder });
                }
                // Execute query
                let result = yield dbQuery.exec();
                result = result === null || result === void 0 ? void 0 : result.map((item) => {
                    var _a;
                    return Object.assign(Object.assign({}, item.toObject()), { image: `${config_1.default.base_url}/${(_a = item.image) === null || _a === void 0 ? void 0 : _a.replace(/\\/g, "/")}` });
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
                // Step 1: Check if the carousel exists in the database
                yield carousel_model_1.carouselModel.deleteOne({ _id: id });
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
