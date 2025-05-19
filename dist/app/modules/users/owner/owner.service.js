"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ownerService = void 0;
const owner_constant_1 = require("./owner.constant");
const QueryBuilder_1 = __importDefault(require("../../../builder/QueryBuilder"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const owner_model_1 = require("./owner.model");
exports.ownerService = {
    async postOwnerIntoDB(data) {
        try {
            return await owner_model_1.OwnerModel.create(data);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`${error.message}`);
            }
            else {
                throw new Error("An unknown error occurred while fetching by ID.");
            }
        }
    },
    async getAllOwnerFromDB(query) {
        try {
            const service_query = new QueryBuilder_1.default(owner_model_1.OwnerModel.find(), query)
                .search(owner_constant_1.OWNER_SEARCHABLE_FIELDS)
                .filter()
                .sort()
                .paginate()
                .fields();
            const result = await service_query.modelQuery;
            const meta = await service_query.countTotal();
            return {
                result,
                meta,
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
    },
    async getSingleOwnerFromDB(id) {
        try {
            return await owner_model_1.OwnerModel.findById(id);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`${error.message}`);
            }
            else {
                throw new Error("An unknown error occurred while fetching by ID.");
            }
        }
    },
    async updateOwnerIntoDB(data) {
        try {
            const isDeleted = await owner_model_1.OwnerModel.findOne({ _id: data.id });
            if (isDeleted?.isDeleted) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "owner is already deleted");
            }
            const result = await owner_model_1.OwnerModel.updateOne({ _id: data.id }, data, {
                new: true,
            });
            if (!result) {
                throw new Error("owner not found.");
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
    },
    async deleteOwnerFromDB(id) {
        try {
            // Step 1: Check if the owner exists in the database
            const isExist = await owner_model_1.OwnerModel.findOne({ _id: id });
            if (!isExist) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "owner not found");
            }
            // Step 4: Delete the home owner from the database
            await owner_model_1.OwnerModel.updateOne({ _id: id }, { isDelete: true });
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
    },
};
