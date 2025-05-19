"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const users_model_1 = require("./users.model");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const sendImageToCloudinary_1 = require("../../../utils/sendImageToCloudinary");
const validateData_1 = require("../../../middlewares/validateData ");
const users_validation_1 = require("./users.validation");
const createUser = async (data) => {
    const result = await users_model_1.userModel.create(data);
    return result;
};
const getAllUsers = async () => {
    return users_model_1.userModel.find({ isDeleted: false });
};
const getSingleUser = async (id) => {
    const result = await users_model_1.userModel.findById(id);
    if (!result || result.isDeleted) {
        throw new AppError_1.default(404, "User not found");
    }
    return result;
};
const updateUser = async (id, data, file) => {
    const parsedData = JSON.parse(data);
    if (file && file.path) {
        const imageName = `${Math.floor(100 + Math.random() * 900)}`;
        const { secure_url } = await (0, sendImageToCloudinary_1.uploadImgToCloudinary)(imageName, file.path);
        parsedData.image = secure_url;
    }
    const Data = await (0, validateData_1.validateData)(users_validation_1.usersUpdateValidation, parsedData);
    const result = await users_model_1.userModel.findByIdAndUpdate(id, Data, { new: true });
    if (!result) {
        throw new AppError_1.default(404, "User not found");
    }
    return result;
};
const deleteUser = async (id) => {
    const result = await users_model_1.userModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!result) {
        throw new AppError_1.default(404, "User not found");
    }
    return result;
};
exports.userService = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
};
