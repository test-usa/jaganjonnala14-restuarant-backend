"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantZoneTypeController = void 0;
const restaurantZon_service_1 = require("./restaurantZon.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const postRestaurantZoneType = (0, catchAsync_1.default)(async (req, res) => {
    const data = req.body;
    const result = await restaurantZon_service_1.restaurantZoneTypeService.postRestaurantZoneTypeIntoDB(data);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.CREATED, success: true, message: "Restaurant zone Created successfully", data: result });
});
const getAllRestaurantZoneType = (0, catchAsync_1.default)(async (req, res) => {
    const result = await restaurantZon_service_1.restaurantZoneTypeService.getAllRestaurantZoneTypeFromDB(req.query);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: "Restaurant zone Fetched successfully", data: result });
});
const getSingleRestaurantZoneType = (0, catchAsync_1.default)(async (req, res) => {
    const result = await restaurantZon_service_1.restaurantZoneTypeService.getSingleRestaurantZoneTypeFromDB(req.params.id);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: "Restaurant zone Fetched successfully", data: result });
});
const updateRestaurantZoneType = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await restaurantZon_service_1.restaurantZoneTypeService.updateRestaurantZoneTypeIntoDB(req.body, id);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: "Restaurant zone Updated successfully", data: result });
});
const deleteRestaurantZoneType = (0, catchAsync_1.default)(async (req, res) => {
    await restaurantZon_service_1.restaurantZoneTypeService.deleteRestaurantZoneTypeFromDB(req.params.id);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: "Restaurant zone Deleted successfully", data: null });
});
exports.restaurantZoneTypeController = { postRestaurantZoneType, getAllRestaurantZoneType, getSingleRestaurantZoneType, updateRestaurantZoneType, deleteRestaurantZoneType };
