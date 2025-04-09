"use strict";
// attribute.service.ts - attribute module
// attribute.service.ts - attribute module
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
exports.AttributeServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const CheckIfDocumentExist_1 = require("../../utils/CheckIfDocumentExist");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const attribute_constant_1 = require("./attribute.constant");
const attribute_model_1 = require("./attribute.model");
const postAttributeIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if Attribute already exists
        const existingAttribute = yield (0, CheckIfDocumentExist_1.checkIfDocumentExists)(attribute_model_1.AttributeModel, "name", data.name);
        if (existingAttribute) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Attribute already exists");
        }
        // Create a new Attribute in the database
        const Attribute = yield attribute_model_1.AttributeModel.create(data);
        return Attribute;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
const getAttributeIntoDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service_query = new QueryBuilder_1.default(attribute_model_1.AttributeModel.find(), query)
            .search(attribute_constant_1.Attribute_searchable_fields)
            .filter()
            .sort()
            .paginate()
            .fields();
        const result = yield service_query.modelQuery.populate("attributeOption");
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
const putAttributeIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isDeleted = yield attribute_model_1.AttributeModel.findOne({ _id: data.id });
        if (isDeleted === null || isDeleted === void 0 ? void 0 : isDeleted.isDelete) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Attribute  is already deleted");
        }
        const result = yield attribute_model_1.AttributeModel.updateOne({ _id: data.id }, data, {
            new: true,
        });
        if (!result) {
            throw new Error("Attribute not found.");
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
const deleteAttributeIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Step 1: Check if the banner exists in the database
        const isExist = yield attribute_model_1.AttributeModel.findOne({ _id: id });
        if (!isExist) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Attribute  not found");
        }
        // Step 4: Delete the home banner from the database
        yield attribute_model_1.AttributeModel.updateOne({ _id: id }, { isDelete: true });
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
exports.AttributeServices = {
    postAttributeIntoDB,
    getAttributeIntoDB,
    putAttributeIntoDB,
    deleteAttributeIntoDB,
};
