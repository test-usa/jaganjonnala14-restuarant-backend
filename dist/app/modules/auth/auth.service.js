"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const users_model_1 = require("../users/user/users.model");
const users_constant_1 = require("../users/user/users.constant");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const owner_model_1 = require("../users/owner/owner.model");
const generateOtp_1 = require("../../utils/generateOtp");
const sendOtpToEmail_1 = require("../../utils/sendOtpToEmail");
const owner_constant_1 = require("../users/owner/owner.constant");
const restuarant_model_1 = require("../restuarant/restuarant.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
exports.authService = {
    async restuarantRegisterRequestIntoDB(data) {
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        try {
            // 1. Check if user already exists
            const existingUser = await users_model_1.userModel
                .findOne({ email: data.businessEmail })
                .session(session);
            if (existingUser) {
                throw new Error("Restaurant owner already exists.");
            }
            const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
            const otp = (0, generateOtp_1.generateOtp)(4);
            // 2. Create new user
            const newUser = await users_model_1.userModel.create([
                {
                    name: "New User",
                    email: data.businessEmail,
                    phone: data.phone,
                    otp,
                    otpExpiresAt: new Date(Date.now() + 5 * 60000),
                    role: users_constant_1.ROLE.RESTAURANT_OWNER,
                    password: hashedPassword,
                },
            ], { session });
            // 3. Create owner
            const newOwner = await owner_model_1.OwnerModel.create([
                {
                    user: newUser[0]._id,
                    businessName: data.businessName,
                    businessEmail: data.businessEmail,
                    status: owner_constant_1.OWNER_STATUS.UNVERIFIED,
                    referralCode: data.referralCode,
                },
            ], { session });
            // 4. Create restaurant
            const restaurantData = {
                owner: newOwner[0]._id,
                restaurantName: "your restaurant name",
                menus: [],
                status: "pending",
                restaurantAddress: data.restaurantAddress,
                phone: "your phone",
                logo: "",
                tagline: "",
                coverPhoto: "",
                images: [],
                description: "",
            };
            await restuarant_model_1.RestaurantModel.create([restaurantData], { session });
            // 5. Commit transaction
            await session.commitTransaction();
            session.endSession();
            return {
                message: "Restaurant registration successful",
            };
        }
        catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw new AppError_1.default(500, "Registration failed: " + error.message);
        }
    },
    async otpValidationIntoDB(data, userEmail) {
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        try {
            const findUnverifiedOwner = await owner_model_1.OwnerModel.findOne({
                businessEmail: userEmail
            }).session(session);
            if (findUnverifiedOwner?.status === owner_constant_1.OWNER_STATUS.PENDING) {
                throw new Error("Your account has already been verified and is now pending admin approval.");
            }
            const findUnverifiedUser = await users_model_1.userModel
                .findOne({ _id: findUnverifiedOwner?.user })
                .session(session);
            if (!findUnverifiedUser) {
                throw new Error("No account found with this email. Please register first.");
            }
            if (Date.now() > findUnverifiedUser.otpExpiresAt.getTime()) {
                throw new Error("Your OTP has expired. Please request a new one.");
            }
            if (data.otp !== findUnverifiedUser.otp) {
                throw new Error("The OTP you entered is incorrect. Please try again.");
            }
            await users_model_1.userModel.updateOne({ email: userEmail }, { $set: { otp: null, otpExpiresAt: null, } }, { session });
            await owner_model_1.OwnerModel.updateOne({ _id: findUnverifiedOwner?._id }, { $set: { status: owner_constant_1.OWNER_STATUS.PENDING } }, { session });
            await session.commitTransaction();
            session.endSession();
            return {
                message: "🎉 Your account has been successfully verified. You can now log in.",
                userId: findUnverifiedUser._id,
            };
        }
        catch (error) {
            await session.abortTransaction();
            session.endSession();
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                throw new Error("Something went wrong while verifying your account.");
            }
        }
    },
    async resendOtpToUser(email) {
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        try {
            const user = await users_model_1.userModel.findOne({ email }).session(session);
            if (!user) {
                throw new Error("No account found with this email.");
            }
            const owner = await owner_model_1.OwnerModel.findOne({ businessEmail: email }).session(session);
            if (!owner) {
                throw new Error("Owner information not found for this email.");
            }
            // Generate new OTP
            const otp = (0, generateOtp_1.generateOtp)(4);
            // Update user with new OTP
            await users_model_1.userModel.updateOne({ _id: user._id }, {
                $set: {
                    otp,
                    otpExpiresAt: new Date(Date.now() + 5 * 60000), // expires in 5 mins
                },
            }, { session });
            // Send OTP via email
            await (0, sendOtpToEmail_1.sendOtpToEmail)(email, otp);
            await session.commitTransaction();
            session.endSession();
            return true;
        }
        catch (err) {
            await session.abortTransaction();
            session.endSession();
            throw err;
        }
    },
    async sendPasswordResetOtp(email) {
        const user = await users_model_1.userModel.findOne({ email });
        if (!user) {
            throw new Error("No account found with this email.");
        }
        const otp = (0, generateOtp_1.generateOtp)(4); // Create your own helper for this
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        user.otp = otp;
        user.otpExpiresAt = expiresAt;
        await user.save();
        await (0, sendOtpToEmail_1.sendOtpToEmail)(email, otp); // Your own implementation
    },
    async verifyPasswordResetOtp(email, otp) {
        const user = await users_model_1.userModel.findOne({ email });
        if (!user)
            throw new Error("User not found.");
        if (!user.otp || !user.otpExpiresAt)
            throw new Error("No OTP found. Please request again.");
        if (Date.now() > user.otpExpiresAt.getTime()) {
            throw new Error("OTP has expired. Please request a new one.");
        }
        if (otp !== user.otp) {
            throw new Error("Invalid OTP. Please try again.");
        }
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();
    },
    async resetPassword(email, newPassword) {
        const user = await users_model_1.userModel.findOne({ email });
        if (!user)
            throw new Error("User not found.");
        const hashed = await bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashed;
        await user.save();
    },
    async approveRestaurantByAdmin(email) {
        const session = await mongoose_1.default.startSession();
        try {
            session.startTransaction();
            // 1. Find the user
            const findOwnerUser = await users_model_1.userModel.findOne({ email, role: "restaurant_owner" }).session(session);
            if (!findOwnerUser) {
                throw new AppError_1.default(400, "You are not a user");
            }
            console.log(findOwnerUser);
            // 2. Activate the Owner
            const owner = await owner_model_1.OwnerModel.findOneAndUpdate({ user: findOwnerUser._id }, { status: "active" }, { new: true, session });
            if (!owner) {
                throw new AppError_1.default(404, "Owner not found");
            }
            // 3. Activate the Restaurant
            const ownerRestaurant = await restuarant_model_1.RestaurantModel.findOneAndUpdate({ owner: owner._id }, { status: "active" }, { new: true, session });
            console.log(ownerRestaurant);
            if (!ownerRestaurant) {
                throw new AppError_1.default(404, "Restaurant not found");
            }
            // 4. Commit transaction
            await session.commitTransaction();
            session.endSession();
            return ownerRestaurant;
        }
        catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }
};
