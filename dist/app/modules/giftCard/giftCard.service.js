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
exports.giftCardService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const giftCard_model_1 = require("./giftCard.model");
const giftCard_constant_1 = require("./giftCard.constant");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
exports.giftCardService = {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield giftCard_model_1.giftCardModel.create(data);
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
    giftCardApply(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code, cartTotal } = data;
                // ১. গিফট কার্ড খুঁজে বের করো
                const giftCard = yield giftCard_model_1.giftCardModel.findOne({
                    code,
                    isActive: true,
                    expiryDate: { $gte: Date.now() },
                    remainingAmount: { $gt: 0 },
                });
                if (!giftCard) {
                    throw new Error("Invalid or expired gift card");
                }
                // ২. রিডিম্পশন হিস্ট্রি চেক করো
                const alreadyRedeemed = giftCard.redeemedBy.some((redemption) => { var _a; return ((_a = redemption.user) === null || _a === void 0 ? void 0 : _a.toString()) === userId; });
                if (alreadyRedeemed && !giftCard.allowMultipleUse) {
                    throw new Error("This gift card has already been used");
                }
                // ৩. অ্যাপ্লাই করা যায় এমন অ্যামাউন্ট ক্যালকুলেট করো
                const applicableAmount = Math.min(giftCard.remainingAmount, cartTotal);
                // ৪. রেসপন্স পাঠাও
                const result = {
                    appliedAmount: applicableAmount,
                    finalAmount: cartTotal - applicableAmount,
                    remainingBalance: giftCard.remainingAmount - applicableAmount,
                    giftCard: {
                        id: giftCard._id,
                        code: giftCard.code,
                        originalAmount: giftCard.amount,
                    },
                };
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
    getAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const service_query = new QueryBuilder_1.default(giftCard_model_1.giftCardModel.find(), query)
                    .search(giftCard_constant_1.GIFTCARD_SEARCHABLE_FIELDS)
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
                    throw new Error(`${error.message}`);
                }
                else {
                    throw new Error("An unknown error occurred while fetching by ID.");
                }
            }
        });
    },
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield giftCard_model_1.giftCardModel.findById(id);
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
                // const isDeleted = await giftCardModel.findOne({ _id: data.id });
                // if (isDeleted?.isDelete) {
                //   throw new AppError(status.NOT_FOUND, "giftCard is already deleted");
                // }
                const result = yield giftCard_model_1.giftCardModel.updateOne({ _id: data.id }, data, {
                    new: true,
                });
                if (!result) {
                    throw new Error("giftCard not found.");
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
                // Step 1: Check if the giftCard exists in the database
                const isExist = yield giftCard_model_1.giftCardModel.findOne({ _id: id });
                if (!isExist) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "giftCard not found");
                }
                // Step 4: Delete the home giftCard from the database
                yield giftCard_model_1.giftCardModel.updateOne({ _id: id }, { isDelete: true });
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
                // Step 1: Check if the giftCard exist in the database
                const existinggiftCard = yield giftCard_model_1.giftCardModel.find({ _id: { $in: ids } });
                if (existinggiftCard.length === 0) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No giftCard found with the given IDs");
                }
                // Step 2: Perform soft delete by updating isDelete field to true
                yield giftCard_model_1.giftCardModel.updateMany({ _id: { $in: ids } }, { isDelete: true });
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
