"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.floorController = void 0;
const floor_service_1 = require("./floor.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const postFloor = (0, catchAsync_1.default)(async (req, res) => {
    const result = await floor_service_1.floorService.postFloorIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Floor Created successfully",
        data: result,
    });
});
const getAllFloor = (0, catchAsync_1.default)(async (req, res) => {
    const result = await floor_service_1.floorService.getAllFloorFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All floor Fetched successfully",
        data: result,
    });
});
const getSingleFloor = (0, catchAsync_1.default)(async (req, res) => {
    const result = await floor_service_1.floorService.getSingleFloorFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Single floor Fetched successfully",
        data: result,
    });
});
const updateFloor = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const result = await floor_service_1.floorService.updateFloorIntoDB(data, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Floor Updated successfully",
        data: result,
    });
});
const deleteFloor = (0, catchAsync_1.default)(async (req, res) => {
    await floor_service_1.floorService.deleteFloorFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Floor Deleted successfully",
        data: null,
    });
});
exports.floorController = {
    postFloor,
    getAllFloor,
    getSingleFloor,
    updateFloor,
    deleteFloor,
};
