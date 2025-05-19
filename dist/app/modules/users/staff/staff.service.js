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
exports.staffService = void 0;
const staff_model_1 = require("./staff.model");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const sendImageToCloudinary_1 = require("../../../utils/sendImageToCloudinary");
const users_model_1 = require("../user/users.model");
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validateData_1 = require("../../../middlewares/validateData ");
const staff_validation_1 = require("./staff.validation");
const createStaff = async (data, file) => {
    const session = await (0, mongoose_1.startSession)();
    session.startTransaction();
    try {
        const { image, ...rest } = data;
        const staffData = { ...rest };
        if (file && file.path) {
            const imageName = `${Math.floor(100 + Math.random() * 900)}`;
            const { secure_url } = await (0, sendImageToCloudinary_1.uploadImgToCloudinary)(imageName, file.path);
            staffData.image = secure_url;
        }
        else {
            staffData.image = "no image";
        }
        const hashedPassword = await bcryptjs_1.default.hash("staff123", 10);
        // Create user
        const userData = {
            name: staffData.name,
            email: staffData.email,
            phone: staffData.phone,
            password: hashedPassword,
            role: staffData.role,
            image: staffData.image,
        };
        const createUser = await users_model_1.userModel.create([userData], { session });
        // Prepare staff data
        const staffDoc = {
            user: createUser[0]._id,
            restaurant: staffData.restaurant,
            workDay: staffData.workDay,
            workTime: staffData.workTime,
        };
        // const validatedData = await validateData<IStaff>(staffPostValidation, staffDoc);
        const createdStaff = await staff_model_1.StaffModel.create([staffDoc], { session });
        // Commit transaction
        await session.commitTransaction();
        session.endSession();
        return createdStaff[0];
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(500, "Failed to create staff: " + error.message);
    }
};
const getAllStaff = async () => {
    const result = await staff_model_1.StaffModel.find({ isDeleted: false }).populate("user").populate("restaurant");
    return result;
};
const getSingleStaff = async (id) => {
    const result = await staff_model_1.StaffModel.findById(id).populate("user").populate("restaurant");
    if (!result || result.isDeleted) {
        throw new AppError_1.default(404, "Staff not found");
    }
    return result;
};
const updateStaff = async (id, data, file) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        let imageUrl = data.image || "no image";
        // If a new image is uploaded
        if (file && file.path) {
            const imageName = `${Math.floor(100 + Math.random() * 900)}`;
            const { secure_url } = await (0, sendImageToCloudinary_1.uploadImgToCloudinary)(imageName, file.path);
            imageUrl = secure_url;
        }
        const userData = {
            name: data.name,
            email: data.email,
            phone: data.phone
        };
        const staffData = await staff_model_1.StaffModel.findOne({ _id: id });
        if (!staffData) {
            throw new AppError_1.default(404, "Staff not found");
        }
        // Update the user
        const updatedUser = await users_model_1.userModel.findByIdAndUpdate(staffData.user, userData, { new: true, session });
        if (!updatedUser) {
            throw new AppError_1.default(404, "User not found");
        }
        const validatedData = await (0, validateData_1.validateData)(staff_validation_1.staffUpdateValidation.unwrap(), data);
        const updatedStaff = await staff_model_1.StaffModel.findByIdAndUpdate(id, validatedData, { new: true, session });
        if (!updatedStaff) {
            throw new AppError_1.default(404, "Staff not found");
        }
        await session.commitTransaction();
        session.endSession();
        return updatedStaff;
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(500, "Failed to update staff: " + error.message);
    }
};
const deleteStaff = async (id) => {
    const result = await staff_model_1.StaffModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!result) {
        throw new AppError_1.default(404, "Staff not found");
    }
    return result;
};
exports.staffService = {
    createStaff,
    getAllStaff,
    getSingleStaff,
    updateStaff,
    deleteStaff,
};
