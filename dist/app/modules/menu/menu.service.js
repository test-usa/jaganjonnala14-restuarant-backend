"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const menu_model_1 = require("./menu.model");
const validateData_1 = require("../../middlewares/validateData ");
const menu_validation_1 = require("./menu.validation");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const restuarant_model_1 = require("../restuarant/restuarant.model");
const mongoose_1 = __importStar(require("mongoose"));
exports.menuService = {
    async postMenuIntoDB(data, file) {
        const session = await mongoose_1.default.startSession();
        try {
            session.startTransaction();
            const menudata = JSON.parse(data);
            if (file && file.path) {
                const imageName = `${Math.floor(100 + Math.random() * 900)}`;
                const { secure_url } = await (0, sendImageToCloudinary_1.uploadImgToCloudinary)(imageName, file.path);
                menudata.image = secure_url;
            }
            else {
                menudata.image = 'no image';
            }
            const validatedData = await (0, validateData_1.validateData)(menu_validation_1.menuPostValidation, menudata);
            const restaurant = await restuarant_model_1.RestaurantModel.findById(validatedData.restaurant).session(session);
            if (!restaurant) {
                throw new AppError_1.default(400, "Restaurant doesn't exist");
            }
            const menu = await menu_model_1.MenuModel.create([validatedData], { session });
            const createdMenu = menu[0];
            await restuarant_model_1.RestaurantModel.findByIdAndUpdate(validatedData.restaurant, { $push: { menus: createdMenu._id } }, { session });
            await session.commitTransaction();
            session.endSession();
            return createdMenu;
        }
        catch (error) {
            // Rollback in case of any failure
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    },
    async getAllMenuFromDB(query) {
        try {
            const result = await menu_model_1.MenuModel.find({});
            return {
                result
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
    async getSingleMenuFromDB(id) {
        try {
            return await menu_model_1.MenuModel.findById(id);
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
    async getMenuWithRestaurantFromDB(id) {
        try {
            return await menu_model_1.MenuModel.find({ restaurant: new mongoose_1.Types.ObjectId(id) });
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
    async updateMenuIntoDB(data, id) {
        try {
            const isDeleted = await menu_model_1.MenuModel.findOne({ _id: id });
            if (isDeleted?.isDeleted) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "menu is already deleted");
            }
            const result = await menu_model_1.MenuModel.updateOne({ _id: id }, data, {
                new: true,
            });
            if (!result) {
                throw new Error("menu not found.");
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
    async deleteMenuFromDB(id) {
        try {
            const isExist = await menu_model_1.MenuModel.findOne({ _id: id });
            if (!isExist) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "menu not found");
            }
            await menu_model_1.MenuModel.findByIdAndDelete({ _id: id });
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
