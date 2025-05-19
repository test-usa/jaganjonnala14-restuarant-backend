"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantLayoutController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const restaurantLayout_service_1 = require("./restaurantLayout.service");
const postRestaurantLayout = (0, catchAsync_1.default)(async (req, res) => {
    const result = await restaurantLayout_service_1.restaurantLayoutService.postRestaurantLayout(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'Restaurant layout created successfully',
        data: result,
    });
});
const getAllRestaurantLayout = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await restaurantLayout_service_1.restaurantLayoutService.getAllRestaurantLayout();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Restaurant layouts fetched successfully',
        data: result,
    });
});
const getSingleRestaurantLayout = (0, catchAsync_1.default)(async (req, res) => {
    const result = await restaurantLayout_service_1.restaurantLayoutService.getSingleRestaurantLayout(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Restaurant layout fetched successfully',
        data: result,
    });
});
const updateRestaurantLayout = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.body.user;
    const result = await restaurantLayout_service_1.restaurantLayoutService.updateRestaurantLayout(req.params.id, user, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Restaurant layout updated successfully',
        data: result,
    });
});
const deleteRestaurantLayout = (0, catchAsync_1.default)(async (req, res) => {
    const result = await restaurantLayout_service_1.restaurantLayoutService.deleteRestaurantLayout(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Restaurant layout deleted successfully',
        data: result,
    });
});
exports.restaurantLayoutController = {
    postRestaurantLayout,
    getAllRestaurantLayout,
    getSingleRestaurantLayout,
    updateRestaurantLayout,
    deleteRestaurantLayout,
};
