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
exports.brandController = void 0;
// brand.controller.ts - brand module
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const brand_service_1 = require("./brand.service");
const brand_model_1 = require("./brand.model");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// brand.controller.ts - brand module
const postbrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract image file paths from uploaded files
    // Create the brand in the database
    const result = yield brand_service_1.brandServcies.createbrandIntoDB(Object.assign(Object.assign({}, req.body), { image: req.file ? req.file.path : undefined }));
    // Send success response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "brand created successfully",
        data: result,
    });
}));
const getbrands = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield brand_service_1.brandServcies.getAllbrandsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All brands fetched successfully",
        data: result,
    });
}));
const getbrandById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = brand_service_1.brandServcies.getbrandByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "brand fetched successfully",
        data: result,
    });
}));
const updatebrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const new_file_path = req.file ? req.file.path : undefined; // নতুন ফাইল থাকলে সেট করো
    // ID দিয়ে ডাটাবেজ থেকে ব্র্যান্ড খোঁজা
    const findExistingDataById = yield brand_model_1.BrandModel.findById(id);
    if (!findExistingDataById) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.NOT_FOUND,
            success: false,
            message: "Brand not found",
            data: null,
        });
    }
    const old_file_name = findExistingDataById.image
        ? path_1.default.basename(findExistingDataById.image)
        : null;
    const old_file_path = old_file_name
        ? path_1.default.join(__dirname, "../../../../uploads", old_file_name)
        : null;
    // যদি নতুন ফাইল থাকে, তাহলে পুরানো ফাইল ডিলিট করো
    if (new_file_path && old_file_path && fs_1.default.existsSync(old_file_path)) {
        try {
            fs_1.default.unlinkSync(old_file_path);
        }
        catch (error) {
            console.error("Error deleting old file:", error);
        }
    }
    // ব্র্যান্ড আপডেট করা
    const result = yield brand_service_1.brandServcies.updatebrandInDB(Object.assign(Object.assign({ id }, req.body), { image: new_file_path || findExistingDataById.image }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Brand updated successfully",
        data: result,
    });
}));
const deletebrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = brand_service_1.brandServcies.deletebrandFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "brand deleted successfully",
        data: result,
    });
}));
const BulkDelete = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ids } = req.body;
    const result = brand_service_1.brandServcies.bulkSoftDeleteFromDB(ids);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "brand deleted successfully",
        data: result,
    });
}));
exports.brandController = {
    postbrand,
    getbrands,
    getbrandById,
    updatebrand,
    deletebrand,
    BulkDelete
};
