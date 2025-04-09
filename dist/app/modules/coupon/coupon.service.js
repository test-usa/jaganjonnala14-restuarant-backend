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
exports.couponService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const coupon_model_1 = require("./coupon.model");
const coupon_constant_1 = require("./coupon.constant");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const mongoose_1 = require("mongoose");
exports.couponService = {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate date range
                if (new Date(data.endDate) <= new Date(data.startDate || Date.now())) {
                    throw new Error('End date must be after start date');
                }
                // Additional validation for percentage discounts
                if (data.discountType === 'percentage' && !data.maxDiscountAmount) {
                    throw new Error('Maximum discount amount is required for percentage discounts');
                }
                const coupon = yield coupon_model_1.couponModel.create(data);
                return coupon;
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
    couponApply(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code, cartTotal } = data;
                // find coupon
                const coupon = yield coupon_model_1.couponModel.findOne({
                    code,
                    isActive: true,
                    startDate: { $lte: Date.now() },
                    endDate: { $gte: Date.now() },
                });
                if (!coupon) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Invalid or expired coupon");
                }
                // useage limit check
                if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
                    throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Coupon usage limit reached");
                }
                // check if user has already used the coupon
                if (coupon.usersUsed.includes(new mongoose_1.Types.ObjectId(userId))) {
                    throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Coupon already used");
                }
                if (cartTotal < coupon.minOrderAmount) {
                    throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Minimum order amount should be at least " + coupon.minOrderAmount);
                }
                // discount calculated
                let discountAmount;
                if (coupon.discountType === "percentage") {
                    discountAmount = (cartTotal * coupon.discountValue) / 100;
                    if (coupon.maxDiscountAmount &&
                        discountAmount > coupon.maxDiscountAmount) {
                        discountAmount = coupon.maxDiscountAmount;
                    }
                }
                else {
                    discountAmount = coupon.discountValue;
                }
                const result = {
                    discountAmount,
                    finalAmount: cartTotal - discountAmount,
                    coupon: {
                        id: coupon._id,
                        code: coupon.code,
                        name: coupon.name,
                        discountType: coupon.discountType,
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
                const service_query = new QueryBuilder_1.default(coupon_model_1.couponModel.find(), query)
                    .search(coupon_constant_1.COUPON_SEARCHABLE_FIELDS)
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
                return yield coupon_model_1.couponModel.findById(id);
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
    update(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isDeleted = yield coupon_model_1.couponModel.findOne({ _id: id });
                if (isDeleted === null || isDeleted === void 0 ? void 0 : isDeleted.isDelete) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "coupon is already deleted");
                }
                const result = yield coupon_model_1.couponModel.updateOne({ _id: id }, data, {
                    new: true,
                });
                if (!result) {
                    throw new Error("coupon not found.");
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
                // Step 1: Check if the coupon exists in the database
                const isExist = yield coupon_model_1.couponModel.findOne({ _id: id });
                if (!isExist) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "coupon not found");
                }
                // Step 4: Delete the home coupon from the database
                yield coupon_model_1.couponModel.updateOne({ _id: id }, { isDelete: true });
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
