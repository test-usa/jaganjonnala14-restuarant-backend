"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.floorService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const floor_model_1 = require("./floor.model");
const restuarant_model_1 = require("../restuarant/restuarant.model");
exports.floorService = {
    async postFloorIntoDB(data) {
        try {
            const restaurant = await restuarant_model_1.RestaurantModel.findOne({
                _id: data.restaurant,
            });
            if (!restaurant) {
                throw new AppError_1.default(400, "restaurant doesn't found");
            }
            const floor = new floor_model_1.FloorModel(data);
            return await floor.save();
        }
        catch (error) {
            throw error;
        }
    },
    async getAllFloorFromDB(query) {
        try {
            const result = await floor_model_1.FloorModel.find({});
            return {
                result,
            };
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
    async getSingleFloorFromDB(id) {
        try {
            return await floor_model_1.FloorModel.findById(id);
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
    async updateFloorIntoDB(data, id) {
        try {
            const isDeleted = await floor_model_1.FloorModel.findOne({ _id: id });
            if (isDeleted?.isDeleted) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "floor is already deleted");
            }
            const result = await floor_model_1.FloorModel.findByIdAndUpdate({ _id: id }, data, {
                new: true,
            });
            if (!result) {
                throw new Error("floor not found.");
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
    async deleteFloorFromDB(id) {
        try {
            const isExist = await floor_model_1.FloorModel.findOne({ _id: id });
            if (!isExist) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "floor not found");
            }
            await floor_model_1.FloorModel.findByIdAndDelete({ _id: id });
            return;
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
