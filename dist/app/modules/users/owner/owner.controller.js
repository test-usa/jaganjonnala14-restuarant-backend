"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ownerController = void 0;
const owner_service_1 = require("./owner.service");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const postOwner = (0, catchAsync_1.default)(async (req, res) => {
    const result = await owner_service_1.ownerService.postOwnerIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Created successfully",
        data: result,
    });
});
const getAllOwner = (0, catchAsync_1.default)(async (req, res) => {
    const result = await owner_service_1.ownerService.getAllOwnerFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fetched successfully",
        data: result,
    });
});
const getSingleOwner = (0, catchAsync_1.default)(async (req, res) => {
    const result = await owner_service_1.ownerService.getSingleOwnerFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fetched successfully",
        data: result,
    });
});
const updateOwner = (0, catchAsync_1.default)(async (req, res) => {
    const result = await owner_service_1.ownerService.updateOwnerIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Updated successfully",
        data: result,
    });
});
const deleteOwner = (0, catchAsync_1.default)(async (req, res) => {
    await owner_service_1.ownerService.deleteOwnerFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Deleted successfully",
        data: null,
    });
});
exports.ownerController = {
    postOwner,
    getAllOwner,
    getSingleOwner,
    updateOwner,
    deleteOwner,
};
