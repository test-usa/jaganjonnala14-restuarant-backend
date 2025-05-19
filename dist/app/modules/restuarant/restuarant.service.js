"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantService = void 0;
const restuarant_model_1 = require("./restuarant.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const postRestaurant = async (data) => {
    const result = await restuarant_model_1.RestaurantModel.create(data);
    return result;
};
const getAllRestaurant = async () => {
    const result = await restuarant_model_1.RestaurantModel.find({ isDeleted: false });
    return result;
};
const getSingleRestaurant = async (id) => {
    const result = await restuarant_model_1.RestaurantModel.findById(id);
    if (!result || result.isDeleted) {
        throw new AppError_1.default(404, "Restaurant not found");
    }
    return result;
};
const updateRestaurant = async (id, payload) => {
    const result = await restuarant_model_1.RestaurantModel.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!result) {
        throw new AppError_1.default(404, "Restaurant not found");
    }
    return result;
};
const deleteRestaurant = async (id) => {
    const result = await restuarant_model_1.RestaurantModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!result) {
        throw new AppError_1.default(404, "Restaurant not found");
    }
    return result;
};
exports.restaurantService = {
    postRestaurant,
    getAllRestaurant,
    getSingleRestaurant,
    updateRestaurant,
    deleteRestaurant,
};
