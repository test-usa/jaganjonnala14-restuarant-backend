"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeOptionController = void 0;
// attributeOption.controller.ts - attributeOption module
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const attributeOption_service_1 = require("./attributeOption.service");
const postAttributeOption = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const result = yield attributeOption_service_1.AttributeOptionServices.postAttributeOptionIntoDB(data);
    // Send a success response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Attribute Option is created succesfully.",
        data: result,
    });
}));
const getAttributeOption = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield attributeOption_service_1.AttributeOptionServices.getCategoriesIntoDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Attribute Option is get succesfully.",
        data: result,
    });
}));
const putAttributeOption = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield attributeOption_service_1.AttributeOptionServices.putAttributeOptionIntoDB(Object.assign({ id }, req.body));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Attribute Option is edited successfully.",
        data: result,
    });
}));
const deleteAttributeOption = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = attributeOption_service_1.AttributeOptionServices.deleteAttributeOptionIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Attribute Option deleted successfully",
        data: result,
    });
}));
exports.AttributeOptionController = {
    postAttributeOption,
    getAttributeOption,
    putAttributeOption,
    deleteAttributeOption,
};
