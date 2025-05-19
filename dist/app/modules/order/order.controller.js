"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const order_service_1 = require("./order.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createOrder = (0, catchAsync_1.default)(async (req, res) => {
    const result = await order_service_1.orderServices.createOrder(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'Order created successfully',
        data: result,
    });
});
const getAllOrders = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await order_service_1.orderServices.getAllOrders();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Orders fetched successfully',
        data: result,
    });
});
const getSingleOrder = (0, catchAsync_1.default)(async (req, res) => {
    const result = await order_service_1.orderServices.getSingleOrder(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Order fetched successfully',
        data: result,
    });
});
const updateOrder = (0, catchAsync_1.default)(async (req, res) => {
    const result = await order_service_1.orderServices.updateOrder(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Order updated successfully',
        data: result,
    });
});
const deleteOrder = (0, catchAsync_1.default)(async (req, res) => {
    const result = await order_service_1.orderServices.deleteOrder(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Order deleted successfully',
        data: result,
    });
});
exports.orderController = {
    createOrder,
    getAllOrders,
    getSingleOrder,
    updateOrder,
    deleteOrder,
};
