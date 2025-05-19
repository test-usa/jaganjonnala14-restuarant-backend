"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const table_model_1 = require("./table.model");
exports.tableService = {
    async postTableIntoDB(data) {
        try {
            return await table_model_1.TableModel.create(data);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`${error.message}`);
            }
            else {
                throw new Error("An unknown error occurred while creating table.");
            }
        }
    },
    async getAllTableFromDB(query) {
        try {
            const result = await table_model_1.TableModel.find({});
            return result;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`${error.message}`);
            }
            else {
                throw new Error("An unknown error occurred while fetching all tables.");
            }
        }
    },
    async getSingleTableFromDB(id) {
        try {
            const table = await table_model_1.TableModel.findById(id);
            if (!table) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Table not found");
            }
            return table;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`${error.message}`);
            }
            else {
                throw new Error("An unknown error occurred while fetching the table.");
            }
        }
    },
    async updateTableIntoDB(id, data) {
        try {
            const table = await table_model_1.TableModel.findById(id);
            if (!table || table.isDeleted) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Table is already deleted or not found");
            }
            const result = await table_model_1.TableModel.findByIdAndUpdate(id, data, { new: true });
            if (!result) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Table update failed");
            }
            return result;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`${error.message}`);
            }
            else {
                throw new Error("An unknown error occurred while updating the table.");
            }
        }
    },
    async deleteTableFromDB(id) {
        try {
            const table = await table_model_1.TableModel.findByIdAndDelete(id);
            if (!table) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Table not found");
            }
            return;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`${error.message}`);
            }
            else {
                throw new Error("An unknown error occurred while deleting the table.");
            }
        }
    },
};
