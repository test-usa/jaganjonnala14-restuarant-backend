"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.uploadMultipleImages = exports.uploadImgToCloudinary = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
const promises_1 = __importDefault(require("fs/promises"));
const config_1 = __importDefault(require("../config"));
const deleteFile = async (filePath) => {
    try {
        await promises_1.default.unlink(filePath);
        console.log(`File deleted successfully: ${filePath}`);
    }
    catch (err) {
        console.error(`Error deleting file: ${err.message}`);
    }
};
const uploadImgToCloudinary = async (name, filePath) => {
    cloudinary_1.v2.config({
        cloud_name: config_1.default.CLOUD_NAME,
        api_key: config_1.default.API_KEY,
        api_secret: config_1.default.API_SECRATE,
    });
    try {
        const uploadResult = await cloudinary_1.v2.uploader.upload(filePath, {
            public_id: name,
        });
        // console.log("Upload result:", uploadResult);
        await deleteFile(filePath);
        return uploadResult;
    }
    catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw new Error("Image upload failed");
    }
};
exports.uploadImgToCloudinary = uploadImgToCloudinary;
const uploadMultipleImages = async (filePaths) => {
    try {
        const imageUrls = [];
        for (const filePath of filePaths) {
            const imageName = `${Math.floor(100 + Math.random() * 900)}-${Date.now()}`;
            const uploadResult = await (0, exports.uploadImgToCloudinary)(imageName, filePath);
            imageUrls.push(uploadResult.secure_url);
        }
        return imageUrls;
    }
    catch (error) {
        console.error("Error uploading multiple images:", error);
        throw new Error("Multiple image upload failed");
    }
};
exports.uploadMultipleImages = uploadMultipleImages;
// Multer storage configuration for local file saving
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(process.cwd(), "uploads")); // Define folder for temporary file storage
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix); // Generate unique file name
    },
});
// Multer upload setup
exports.upload = (0, multer_1.default)({ storage: storage });
