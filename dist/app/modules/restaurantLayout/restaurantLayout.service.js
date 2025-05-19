"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantLayoutService = void 0;
const restaurantLayout_model_1 = require("./restaurantLayout.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const restuarant_model_1 = require("../restuarant/restuarant.model");
const floor_model_1 = require("../floor/floor.model");
const owner_model_1 = require("../users/owner/owner.model");
const mongoose_1 = __importDefault(require("mongoose"));
const postRestaurantLayout = async (payload) => {
    const isRestaurantExists = await restuarant_model_1.RestaurantModel.findById({ _id: payload.restaurant });
    if (!isRestaurantExists) {
        throw new AppError_1.default(400, "the restaurant is not exist");
    }
    const isFloorExists = await floor_model_1.FloorModel.findById({ _id: payload.floor });
    if (!isFloorExists) {
        throw new AppError_1.default(400, "the floor is not exist");
    }
    const result = await restaurantLayout_model_1.RestaurantLayoutModel.create(payload);
    return result;
};
const getAllRestaurantLayout = async () => {
    const result = await restaurantLayout_model_1.RestaurantLayoutModel.find({ isDeleted: false })
        .populate({
        path: 'restaurant',
        populate: {
            path: 'menus',
            model: 'Menu'
        }
    })
        .populate('floor');
    return result;
};
const getSingleRestaurantLayout = async (id) => {
    const result = await restaurantLayout_model_1.RestaurantLayoutModel.findById(id)
        .populate('floor')
        .populate({
        path: 'restaurant',
        populate: {
            path: 'menus', // this will now populate the menu documents
        },
    });
    if (!result || result.isDeleted) {
        throw new AppError_1.default(404, 'Restaurant layout not found');
    }
    return result;
};
const updateRestaurantLayout = async (id, user, payload) => {
    const floor = await floor_model_1.FloorModel.findOne({
        _id: new mongoose_1.default.Types.ObjectId(payload.floor),
        isDeleted: false,
    });
    if (!floor) {
        throw new AppError_1.default(403, "No floor found");
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid Restaurant Layout ID");
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(user)) {
        throw new AppError_1.default(400, "Invalid User ID");
    }
    const restaurantOwner = await owner_model_1.OwnerModel.findOne({
        user: new mongoose_1.default.Types.ObjectId(user),
        isDeleted: false,
    });
    if (!restaurantOwner) {
        throw new AppError_1.default(403, "No owner found for the given user");
    }
    const updated = await restaurantLayout_model_1.RestaurantLayoutModel.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!updated) {
        throw new AppError_1.default(404, "Restaurant layout not found");
    }
    return updated;
};
const deleteRestaurantLayout = async (id) => {
    const deleted = await restaurantLayout_model_1.RestaurantLayoutModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!deleted) {
        throw new AppError_1.default(404, 'Restaurant layout not found');
    }
    return deleted;
};
exports.restaurantLayoutService = {
    postRestaurantLayout,
    getAllRestaurantLayout,
    getSingleRestaurantLayout,
    updateRestaurantLayout,
    deleteRestaurantLayout,
};
