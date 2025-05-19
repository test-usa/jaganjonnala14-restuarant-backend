"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const category_model_1 = require("./category.model");
const validateData_1 = require("../../middlewares/validateData ");
const category_validation_1 = require("./category.validation");
const restuarant_model_1 = require("../restuarant/restuarant.model");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
exports.categoryService = {
    async postCategoryIntoDB(data, file) {
        try {
            const categorydata = JSON.parse(data);
            const validatedData = await (0, validateData_1.validateData)(category_validation_1.categoryPostValidation, categorydata);
            if (file) {
                const imageName = `${Math.floor(100 + Math.random() * 900)}`;
                const path = file.path;
                const { secure_url } = (await (0, sendImageToCloudinary_1.uploadImgToCloudinary)(imageName, path));
                validatedData.image = secure_url;
            }
            else {
                validatedData.image = 'no image';
            }
            const restaurant = await restuarant_model_1.RestaurantModel.findOne({ _id: validatedData.restaurant });
            if (!restaurant) {
                throw new AppError_1.default(400, "restaurant doesn't found");
            }
            return await category_model_1.CategoryModel.create(validatedData);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`${error.message}`);
            }
            else {
                throw new AppError_1.default(400, "Category Can not be created");
            }
        }
    },
    async getAllCategoryFromDB(query) {
        try {
            const result = await category_model_1.CategoryModel.find({});
            return result;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`${error.message}`);
            }
            else {
                throw new Error("Categories can not found");
            }
        }
    },
    async getSingleCategoryFromDB(id) {
        try {
            return await category_model_1.CategoryModel.findById(id);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`${error.message}`);
            }
            else {
                throw new Error("Category can not retrieved");
            }
        }
    },
    async updateCategoryIntoDB(id, data) {
        try {
            const isDeleted = await category_model_1.CategoryModel.findOne({ _id: id });
            if (!isDeleted) {
                throw new AppError_1.default(404, "category not found");
            }
            const result = await category_model_1.CategoryModel.findByIdAndUpdate({ _id: id }, data, {
                new: true,
            });
            return result;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`${error.message}`);
            }
            else {
                throw new Error("Category can not be updated");
            }
        }
    },
    async deleteCategoryFromDB(id) {
        try {
            const isExist = await category_model_1.CategoryModel.findOne({ _id: id });
            if (!isExist) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "category not found");
            }
            const data = await category_model_1.CategoryModel.findByIdAndDelete({ _id: id }, { isDelete: true });
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`${error.message}`);
            }
            else {
                throw new Error("Category cannot be deleted");
            }
        }
    },
};
