"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const analytic_service_1 = require("./analytic.service");
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const analytics = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await analytic_service_1.analyticService.allAnalytic(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Restaurant Analytics data retrieved successfully",
        data: result,
    });
});
exports.analyticController = {
    analytics
};
