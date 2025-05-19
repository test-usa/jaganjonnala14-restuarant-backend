"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = void 0;
const category_service_1 = require("./category.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const postCategory = (0, catchAsync_1.default)(async (req, res) => {
    const file = req.file;
    const data = req.body.data;
    const result = await category_service_1.categoryService.postCategoryIntoDB(data, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Category Created successfully",
        data: result,
    });
});
const getAllCategory = (0, catchAsync_1.default)(async (req, res) => {
    const result = await category_service_1.categoryService.getAllCategoryFromDB(req.query);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: "Categories Fetched successfully", data: result });
});
const getSingleCategory = (0, catchAsync_1.default)(async (req, res) => {
    const result = await category_service_1.categoryService.getSingleCategoryFromDB(req.params.id);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: "Single category Fetched successfully", data: result });
});
const updateCategory = (0, catchAsync_1.default)(async (req, res) => {
    const updateData = req.body;
    const id = req.params.id;
    const result = await category_service_1.categoryService.updateCategoryIntoDB(id, updateData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Category updated successfully",
        data: result,
    });
});
const deleteCategory = (0, catchAsync_1.default)(async (req, res) => {
    const data = await category_service_1.categoryService.deleteCategoryFromDB(req.params.id);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: "Category Deleted successfully", data: data });
});
exports.categoryController = { postCategory, getAllCategory, getSingleCategory, updateCategory, deleteCategory };
