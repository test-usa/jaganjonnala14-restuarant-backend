"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restuarantController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const restuarant_service_1 = require("./restuarant.service");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const validateData_1 = require("../../middlewares/validateData ");
const restuarant_validation_1 = require("./restuarant.validation");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const postRestuarant = (0, catchAsync_1.default)(async (req, res) => {
    const data = JSON.parse(req.body.data);
    const files = req.files?.images?.map((file) => file.path);
    const uploadLogo = req.files?.logo?.[0]?.path;
    const { secure_url } = await (0, sendImageToCloudinary_1.uploadImgToCloudinary)("logo", uploadLogo);
    const uploadedImages = await (0, sendImageToCloudinary_1.uploadMultipleImages)(files);
    const { images, coverPhoto, logo, ...rest } = data;
    const restaurantData = { images: uploadedImages, logo: secure_url, coverPhoto: uploadedImages[0], ...rest };
    const result = await restuarant_service_1.restaurantService.postRestaurant(restaurantData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Restaurant created successfully",
        data: result,
    });
});
const getAllRestuarant = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await restuarant_service_1.restaurantService.getAllRestaurant();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Restaurants retrieved successfully",
        data: result,
    });
});
const getSingleRestuarant = (0, catchAsync_1.default)(async (req, res) => {
    const result = await restuarant_service_1.restaurantService.getSingleRestaurant(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Restaurant retrieved successfully",
        data: result,
    });
});
const updateRestuarant = (0, catchAsync_1.default)(async (req, res) => {
    // Parse data only if it exists and is a string
    let data = {};
    if (req.body.data && typeof req.body.data === 'string') {
        data = JSON.parse(req.body.data);
    }
    else if (req.body.data) {
        data = req.body.data; // Handle non-string data if applicable
    }
    // if (data.status) {
    //   throw new AppError(400, "You cannot update status");
    // }
    const id = req.params.id;
    // Safely handle file uploads
    const files = req.files?.images?.map((file) => file.path) || [];
    const uploadLogo = req.files?.logo?.[0]?.path;
    const { images, coverPhoto, logo, ...rest } = data;
    const restaurantData = { ...rest };
    // Upload logo if provided
    if (uploadLogo) {
        try {
            const { secure_url } = await (0, sendImageToCloudinary_1.uploadImgToCloudinary)("logo", uploadLogo);
            restaurantData.logo = secure_url;
        }
        catch (err) {
            console.error("Error uploading logo to Cloudinary:", err);
            throw new AppError_1.default(500, "Failed to upload logo");
        }
    }
    // Upload images if provided
    if (files.length > 0) {
        try {
            const uploadedImages = await (0, sendImageToCloudinary_1.uploadMultipleImages)(files);
            restaurantData.images = uploadedImages;
            restaurantData.coverPhoto = uploadedImages[0];
        }
        catch (err) {
            console.error("Error uploading images to Cloudinary:", err);
            throw new AppError_1.default(500, "Failed to upload images");
        }
    }
    const validate = await (0, validateData_1.validateData)(restuarant_validation_1.restuarantUpdateValidation, restaurantData);
    const result = await restuarant_service_1.restaurantService.updateRestaurant(id, validate);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Restaurant updated successfully",
        data: result,
    });
});
const deleteRestuarant = (0, catchAsync_1.default)(async (req, res) => {
    const result = await restuarant_service_1.restaurantService.deleteRestaurant(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Restaurant deleted successfully",
        data: result,
    });
});
exports.restuarantController = {
    postRestuarant,
    getAllRestuarant,
    getSingleRestuarant,
    updateRestuarant,
    deleteRestuarant,
};
