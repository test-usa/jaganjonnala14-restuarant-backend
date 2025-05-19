"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const staff_service_1 = require("./staff.service");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const createStaff = (0, catchAsync_1.default)(async (req, res) => {
    const data = JSON.parse(req.body.data);
    const uploadImage = req.file;
    console.log("11", uploadImage);
    const result = await staff_service_1.staffService.createStaff(data, uploadImage);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Staff created successfully",
        data: result,
    });
});
const getAllStaff = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await staff_service_1.staffService.getAllStaff();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "All staff retrieved successfully",
        data: result,
    });
});
const getSingleStaff = (0, catchAsync_1.default)(async (req, res) => {
    const result = await staff_service_1.staffService.getSingleStaff(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Staff retrieved successfully",
        data: result,
    });
});
const updateStaff = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    console.log(id, req.body.data);
    const data = JSON.parse(req.body.data);
    const file = req.file;
    const result = await staff_service_1.staffService.updateStaff(id, data, file);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Staff updated successfully",
        data: result,
    });
});
const deleteStaff = (0, catchAsync_1.default)(async (req, res) => {
    const result = await staff_service_1.staffService.deleteStaff(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Staff deleted successfully",
        data: result,
    });
});
exports.staffController = {
    createStaff,
    getAllStaff,
    getSingleStaff,
    updateStaff,
    deleteStaff,
};
