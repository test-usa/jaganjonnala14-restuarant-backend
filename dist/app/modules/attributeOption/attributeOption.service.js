"use strict";
// attributeOption.service.ts - attributeOption module
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
exports.AttributeOptionServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const CheckIfDocumentExist_1 = require("../../utils/CheckIfDocumentExist");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const attributeOption_constant_1 = require("./attributeOption.constant");
const attributeOption_model_1 = __importDefault(require("./attributeOption.model"));
const postAttributeOptionIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if AttributeOption already exists
        const existingAttributeOption = yield (0, CheckIfDocumentExist_1.checkIfDocumentExists)(attributeOption_model_1.default, "name", data.name);
        if (existingAttributeOption) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Attribute Option already exists");
        }
        // Create a new AttributeOption in the database
        const AttributeOption = yield attributeOption_model_1.default.create(data);
        return AttributeOption;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
const getCategoriesIntoDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service_query = new QueryBuilder_1.default(attributeOption_model_1.default.find(), query)
            .search(attributeOption_constant_1.AttributeOption_searchable_fields)
            .filter()
            .sort()
            .paginate()
            .fields();
        const result = yield service_query.modelQuery;
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
const putAttributeOptionIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isDeleted = yield attributeOption_model_1.default.findOne({ _id: data.id });
        if (isDeleted === null || isDeleted === void 0 ? void 0 : isDeleted.isDelete) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Attribute Option is already deleted");
        }
        const result = yield attributeOption_model_1.default.updateOne({ _id: data.id }, data, {
            new: true,
        });
        if (!result) {
            throw new Error("AttributeOption not found.");
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
const deleteAttributeOptionIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Step 1: Check if the banner exists in the database
        const isExist = yield attributeOption_model_1.default.findOne({ _id: id });
        if (!isExist) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Attribute Option not found");
        }
        // Step 4: Delete the home banner from the database
        yield attributeOption_model_1.default.updateOne({ _id: id }, { isDelete: true });
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
exports.AttributeOptionServices = {
    postAttributeOptionIntoDB,
    getCategoriesIntoDB,
    putAttributeOptionIntoDB,
    deleteAttributeOptionIntoDB,
};
