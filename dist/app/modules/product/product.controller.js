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
exports.productController = void 0;
const product_service_1 = require("./product.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const product_model_1 = require("./product.model");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const create = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.productService.create(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Created successfully",
        data: result,
    });
}));
const filterProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.productService.filterProducts(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fetched successfully",
        data: result,
    });
}));
const searchProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.productService.searchProducts(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fetched successfully",
        data: result,
    });
}));
const getAll = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.productService.getAll(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fetched successfully",
        data: result,
    });
}));
const getAllByCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.productService.getAllByCategory(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fetched successfully",
        data: result,
    });
}));
const getById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.productService.getById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fetched successfully",
        data: result,
    });
}));
const update = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield product_model_1.productModel.findOne({ _id: id });
    if (!product) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.NOT_FOUND,
            success: false,
            message: "Product not found",
            data: null,
        });
    }
    const isNewFeatureImageUploaded = !!req.body.productFeatureImage;
    const isNewImagesUploaded = req.body.productImages && req.body.productImages.length > 0;
    // আগের ইমেজ রেখে দিতে হবে যদি নতুন ইমেজ আপলোড না করা হয়
    if (!isNewFeatureImageUploaded) {
        req.body.productFeatureImage = product.productFeatureImage;
    }
    if (!isNewImagesUploaded) {
        req.body.productImages = product.productImages;
    }
    // নতুন ছবি থাকলে আগেরটা ডিলিট করবো
    if (isNewFeatureImageUploaded && product.productFeatureImage) {
        const oldFeatureImagePath = path_1.default.join(__dirname, "../../../../uploads", path_1.default.basename(product.productFeatureImage));
        if (fs_1.default.existsSync(oldFeatureImagePath)) {
            try {
                fs_1.default.unlinkSync(oldFeatureImagePath);
            }
            catch (error) {
                throw new Error(`Error deleting old feature image: ${error.message}`);
            }
        }
    }
    // নতুন productImages থাকলে পুরনোগুলো মুছবো
    if (isNewImagesUploaded && product.productImages.length > 0) {
        product.productImages.forEach((oldImage) => {
            const oldImagePath = path_1.default.join(__dirname, "../../../../uploads", path_1.default.basename(oldImage));
            if (fs_1.default.existsSync(oldImagePath)) {
                try {
                    fs_1.default.unlinkSync(oldImagePath);
                }
                catch (error) {
                    console.error("Error deleting old product image:", error);
                }
            }
        });
    }
    const result = yield product_service_1.productService.update(Object.assign(Object.assign({}, req.body), { id }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Updated successfully",
        data: result,
    });
}));
const deleteEntity = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield product_service_1.productService.delete(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Deleted successfully",
        data: null,
    });
}));
const bulkDelete = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ids = req.body.ids; // Expecting an array of IDs to be passed for bulk delete
    if (!Array.isArray(ids) || ids.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: "Invalid IDs array",
            data: null,
        });
    }
    yield product_service_1.productService.bulkDelete(ids);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Bulk delete successful",
        data: null,
    });
}));
exports.productController = {
    create,
    getAll,
    getAllByCategory,
    getById,
    update,
    delete: deleteEntity,
    bulkDelete,
    filterProducts,
    searchProducts
};
