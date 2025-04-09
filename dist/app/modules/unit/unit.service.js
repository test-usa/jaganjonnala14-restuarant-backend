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
exports.unitService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const unit_constant_1 = require("./unit.constant");
const unit_model_1 = require("./unit.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
exports.unitService = {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield unit_model_1.unitModel.create(data);
        });
    },
    getAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const service_query = new QueryBuilder_1.default(unit_model_1.unitModel.find(), query)
                    .search(unit_constant_1.UNIT_SEARCHABLE_FIELDS)
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
    },
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield unit_model_1.unitModel.findById(id);
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
    },
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield unit_model_1.unitModel.findByIdAndUpdate(id, data, { new: true });
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
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Step 1: Check if the banner exists in the database
                const isExist = yield unit_model_1.unitModel.findOne({ _id: id });
                if (!isExist) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "unit not found");
                }
                // Step 4: Delete the  from the database
                yield unit_model_1.unitModel.updateOne({ _id: id }, { isDelete: true });
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
    },
    bulkDelete(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!ids || !Array.isArray(ids) || ids.length === 0) {
                    throw new Error("Invalid IDs provided");
                }
                // Step 1: Check if the units exist in the database
                const existingData = yield unit_model_1.unitModel.find({ _id: { $in: ids } });
                if (existingData.length === 0) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No units found with the given IDs");
                }
                // Step 2: Perform soft delete by updating `isDelete` field to `true`
                yield unit_model_1.unitModel.updateMany({ _id: { $in: ids } }, { isDelete: true });
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
    },
};
