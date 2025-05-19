"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableController = void 0;
const table_service_1 = require("./table.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const postTable = (0, catchAsync_1.default)(async (req, res) => {
    const result = await table_service_1.tableService.postTableIntoDB(req.body);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.CREATED, success: true, message: "Table Created successfully", data: result });
});
const getAllTable = (0, catchAsync_1.default)(async (req, res) => {
    const result = await table_service_1.tableService.getAllTableFromDB(req.query);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: "All table Fetched successfully", data: result });
});
const getSingleTable = (0, catchAsync_1.default)(async (req, res) => {
    const result = await table_service_1.tableService.getSingleTableFromDB(req.params.id);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: "Single table Fetched successfully", data: result });
});
const updateTable = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const result = await table_service_1.tableService.updateTableIntoDB(id, data);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: "Table Updated successfully", data: result });
});
const deleteTable = (0, catchAsync_1.default)(async (req, res) => {
    await table_service_1.tableService.deleteTableFromDB(req.params.id);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: "Table Deleted successfully", data: null });
});
exports.tableController = { postTable, getAllTable, getSingleTable, updateTable, deleteTable };
