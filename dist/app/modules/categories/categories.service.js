"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
// categories.service.ts - categories module
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
exports.categoryServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const CheckIfDocumentExist_1 = require("../../utils/CheckIfDocumentExist");
const categories_model_1 = __importDefault(require("./categories.model"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const categories_constant_1 = require("./categories.constant");
const postCategoryIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if category already exists
        const existingCategory = yield (0, CheckIfDocumentExist_1.checkIfDocumentExists)(categories_model_1.default, "name", data.name);
        if (existingCategory) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category already exists");
        }
        // Create a new category in the database
        const category = yield categories_model_1.default.create(data);
        return category;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
const getCategoriesIntoDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service_query = new QueryBuilder_1.default(categories_model_1.default.find(), query)
            .search(categories_constant_1.category_searchable_fields)
            .filter()
            .sort()
            .paginate()
            .fields();
        const result = yield service_query.modelQuery
            .populate({
            path: "subcategories",
            model: "Category",
            populate: {
                path: "subcategories",
                model: "Category",
            },
        })
            .populate({
            path: "categories",
            model: "Category",
            populate: {
                path: "subcategories",
                model: "Category",
            },
        })
            .populate({
            path: "parentCategory",
            model: "Category",
        })
            .populate({
            path: "category",
            model: "Category",
        });
        const meta = yield service_query.countTotal();
        return {
            result,
            meta,
        };
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        else {
            throw new Error("An unknown error occurred.");
        }
    }
});
const getCategoriesForSidebarIntoDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service_query = new QueryBuilder_1.default(categories_model_1.default.find({ status: "active" }), query)
            .search([])
            .filter()
            .sort()
            .paginate()
            .fields();
        const result = yield service_query.modelQuery
            .populate({
            path: "subcategories",
            model: "Category",
            select: "name _id type",
            populate: {
                path: "subcategories",
                model: "Category",
                select: "name _id type",
            },
        })
            .populate({
            path: "categories",
            model: "Category",
            select: "name _id type",
            populate: {
                path: "subcategories",
                model: "Category",
                select: "name _id type",
            },
        })
            .populate({
            path: "parentCategory",
            model: "Category",
            select: "name _id type",
        })
            .populate({
            path: "category",
            model: "Category",
            select: "name _id type",
        });
        const meta = yield service_query.countTotal();
        return {
            result,
            meta,
        };
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        else {
            throw new Error("An unknown error occurred.");
        }
    }
});
const putCategoryIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isDeleted = yield categories_model_1.default.findOne({ _id: data.id });
        if (isDeleted === null || isDeleted === void 0 ? void 0 : isDeleted.isDelete) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category is already deleted");
        }
        const result = yield categories_model_1.default.updateOne({ _id: data.id }, data, {
            new: true,
        });
        if (!result) {
            throw new Error("Category not found.");
        }
        return result;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Database Update Error: ${error.message}`);
        }
        else {
            throw new Error("An unknown error occurred.");
        }
    }
});
const deleteCategoryIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Step 1: Check if the banner exists in the database
        const isExist = yield categories_model_1.default.findOne({ _id: id });
        if (!isExist) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
        }
        // Step 4: Delete the home banner from the database
        yield categories_model_1.default.updateOne({ _id: id }, { isDelete: true });
        return;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        else {
            throw new Error("An unknown error occurred.");
        }
    }
});
const deleteBulkCategoryIntoDB = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            throw new Error("Invalid IDs provided");
        }
        // Step 1: Check if the units exist in the database
        const existingData = yield categories_model_1.default.find({ _id: { $in: ids } });
        if (existingData.length === 0) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No categories found with the given IDs");
        }
        // Step 2: Perform soft delete by updating `isDelete` field to `true`
        yield categories_model_1.default.updateMany({ _id: { $in: ids } }, { isDelete: true });
        return;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        else {
            throw new Error("An unknown error occurred.");
        }
    }
});
exports.categoryServices = {
    postCategoryIntoDB,
    getCategoriesIntoDB,
    putCategoryIntoDB,
    deleteCategoryIntoDB,
    deleteBulkCategoryIntoDB,
    getCategoriesForSidebarIntoDB,
};
