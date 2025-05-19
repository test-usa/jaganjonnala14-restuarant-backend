"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantZoneTypeService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const restaurantZone_model_1 = require("./restaurantZone.model");
exports.restaurantZoneTypeService = {
    async postRestaurantZoneTypeIntoDB(data) {
        try {
            const result = await restaurantZone_model_1.RestaurantZone.create(data);
            return result;
        }
        catch (error) {
            throw error;
        }
    },
    async getAllRestaurantZoneTypeFromDB(query) {
        try {
            const result = await restaurantZone_model_1.RestaurantZone.find({});
            return result;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`${error.message}`);
            }
            else {
                throw new Error("An unknown error occurred while fetching by ID.");
            }
        }
    },
    async getSingleRestaurantZoneTypeFromDB(id) {
        try {
            return await restaurantZone_model_1.RestaurantZone.findById(id);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`${error.message}`);
            }
            else {
                throw new Error("An unknown error occurred while fetching by ID.");
            }
        }
    },
    async updateRestaurantZoneTypeIntoDB(data, id) {
        try {
            const isDeleted = await restaurantZone_model_1.RestaurantZone.findOne({ _id: id });
            if (isDeleted?.isDeleted) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "restaurantZoneType is already deleted");
            }
            const result = await restaurantZone_model_1.RestaurantZone.updateOne({ _id: id }, data, {
                new: true,
            });
            if (!result) {
                throw new Error("restaurantZoneType not found.");
            }
            return result;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`${error.message}`);
            }
            else {
                throw new Error("An unknown error occurred while fetching by ID.");
            }
        }
    },
    async deleteRestaurantZoneTypeFromDB(id) {
        try {
            const isExist = await restaurantZone_model_1.RestaurantZone.findOne({ _id: id });
            if (!isExist) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "restaurantZoneType not found");
            }
            const result = await restaurantZone_model_1.RestaurantZone.findByIdAndDelete({ _id: id });
            return result;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`${error.message}`);
            }
            else {
                throw new Error("An unknown error occurred while fetching by ID.");
            }
        }
    },
};
