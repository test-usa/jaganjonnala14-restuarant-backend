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
exports.brandServcies = void 0;
// brand.service.ts - brand module
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const formatImage_1 = require("../../utils/formatImage");
const brand_model_1 = require("./brand.model");
const brand_constant_1 = require("./brand.constant");
// brand.service.ts - brand module
const createbrandIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield brand_model_1.BrandModel.create(data);
        return result;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
const getbrandByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield brand_model_1.BrandModel.findById(id);
        if (!result) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "brand not found.");
        }
        if (result.isDelete) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This brand is deleted.");
        }
        return result;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
const getAllbrandsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service_query = new QueryBuilder_1.default(brand_model_1.BrandModel.find(), query)
            .search(brand_constant_1.brand_searchable_fields)
            .filter()
            .sort()
            .paginate()
            .fields();
        let result = yield service_query.modelQuery;
        result = (0, formatImage_1.formatResultImage)(result, "image");
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
const updatebrandInDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isDeleted = yield brand_model_1.BrandModel.findOne({ _id: data.id });
        if (isDeleted === null || isDeleted === void 0 ? void 0 : isDeleted.isDelete) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "brand is already deleted");
        }
        const result = yield brand_model_1.BrandModel.updateOne({ _id: data.id }, data, {
            new: true,
        });
        if (!result) {
            throw new Error("brand not found.");
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
const deletebrandFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Step 1: Check if the banner exists in the database
        const isExist = yield brand_model_1.BrandModel.findOne({ _id: id });
        if (!isExist) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "brand not found");
        }
        // Step 4: Delete the home banner from the database
        yield brand_model_1.BrandModel.updateOne({ _id: id }, { isDelete: true });
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
const bulkSoftDeleteFromDB = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            throw new Error("Invalid IDs provided");
        }
        // Step 1: Check if the brands exist in the database
        const existingBrands = yield brand_model_1.BrandModel.find({ _id: { $in: ids } });
        if (existingBrands.length === 0) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No brands found with the given IDs");
        }
        // Step 2: Perform soft delete by updating `isDelete` field to `true`
        yield brand_model_1.BrandModel.updateMany({ _id: { $in: ids } }, { isDelete: true });
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
exports.brandServcies = {
    createbrandIntoDB,
    getbrandByIdFromDB,
    getAllbrandsFromDB,
    updatebrandInDB,
    deletebrandFromDB,
    bulkSoftDeleteFromDB
};
