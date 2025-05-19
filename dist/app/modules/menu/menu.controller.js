"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuController = void 0;
const menu_service_1 = require("./menu.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const postMenu = (0, catchAsync_1.default)(async (req, res) => {
    const file = req.file;
    const data = req.body.data;
    const result = await menu_service_1.menuService.postMenuIntoDB(data, file);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.CREATED, success: true, message: "Menu Created successfully", data: result });
});
const getAllMenu = (0, catchAsync_1.default)(async (req, res) => {
    const result = await menu_service_1.menuService.getAllMenuFromDB(req.query);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: "Menus Fetched successfully", data: result });
});
const getSingleMenu = (0, catchAsync_1.default)(async (req, res) => {
    const result = await menu_service_1.menuService.getSingleMenuFromDB(req.params.id);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: "Single Menu Fetched successfully", data: result });
});
const updateMenu = (0, catchAsync_1.default)(async (req, res) => {
    const data = req.body;
    const id = req.params.id;
    const result = await menu_service_1.menuService.updateMenuIntoDB(data, id);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: "Menu Updated successfully", data: result });
});
const deleteMenu = (0, catchAsync_1.default)(async (req, res) => {
    const result = await menu_service_1.menuService.deleteMenuFromDB(req.params.id);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: "Menu Deleted successfully", data: result });
});
const MenuWithRestaurant = (0, catchAsync_1.default)(async (req, res) => {
    const result = await menu_service_1.menuService.getMenuWithRestaurantFromDB(req.params.restaurantId);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: "Restaurant menu fetched successfully", data: result });
});
exports.menuController = { postMenu, getAllMenu, getSingleMenu, updateMenu, deleteMenu, MenuWithRestaurant };
