"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const generateToken_1 = __importDefault(require("../../utils/generateToken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../../config"));
const users_model_1 = require("../users/user/users.model");
const auth_service_1 = require("./auth.service");
const owner_model_1 = require("../users/owner/owner.model");
const owner_constant_1 = require("../users/owner/owner.constant");
const restuarantRegisterRequest = (0, catchAsync_1.default)(async (req, res, next) => {
    const pendingRestuarant = await auth_service_1.authService.restuarantRegisterRequestIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "An OTP has been sent to your email and phone for verification.",
        data: pendingRestuarant,
    });
});
const otpValidation = (0, catchAsync_1.default)(async (req, res, next) => {
    const userEmail = req.query.email;
    await auth_service_1.authService.otpValidationIntoDB(req.body, userEmail);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "OTP verified. Your account is now pending admin approval.",
        data: null,
    });
});
const resendOtp = (0, catchAsync_1.default)(async (req, res, next) => {
    const email = req.query.email;
    if (!email) {
        throw new Error("Email is required to resend OTP.");
    }
    await auth_service_1.authService.resendOtpToUser(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "A new OTP has been sent to your email.",
        data: null,
    });
});
const forgotPassword = (0, catchAsync_1.default)(async (req, res) => {
    const { email } = req.body;
    await auth_service_1.authService.sendPasswordResetOtp(email);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "An OTP has been sent to your email to reset your password.",
        data: null,
    });
});
const verifyResetOtp = (0, catchAsync_1.default)(async (req, res) => {
    const { email, otp } = req.body;
    await auth_service_1.authService.verifyPasswordResetOtp(email, otp);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "OTP verified. You can now reset your password.",
        data: null,
    });
});
const resetPassword = (0, catchAsync_1.default)(async (req, res) => {
    const { email, newPassword } = req.body;
    await auth_service_1.authService.resetPassword(email, newPassword);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Your password has been reset successfully.",
        data: null,
    });
});
const Login = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await users_model_1.userModel.findOne({ email }).select("+password");
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User does not exist. Please register.");
    }
    if (!user.password) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "This account was created using OAuth. Please login with Google.");
    }
    const isPasswordMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Incorrect password.");
    }
    // ✅ Owner check (if role is restaurant_owner)
    if (user.role === "restaurant_owner") {
        const owner = await owner_model_1.OwnerModel.findOne({ user: user._id });
        if (!owner) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Owner profile not found. Please register as a restaurant owner.");
        }
        if (owner.status === owner_constant_1.OWNER_STATUS.UNVERIFIED) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Your account is not verified. Please verify OTP.");
        }
        if (owner.status === owner_constant_1.OWNER_STATUS.PENDING) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Your account is pending admin approval.");
        }
        if (owner.status === owner_constant_1.OWNER_STATUS.REJECTED) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Your owner request has been rejected.");
        }
    }
    console.log(user._id);
    const restaurantData = await owner_model_1.OwnerModel.findOne({ user: user._id });
    const payload = {
        userId: user._id,
        restaurantId: restaurantData?.user,
        role: user.role,
    };
    const accessToken = (0, generateToken_1.default)(payload, config_1.default.JWT_ACCESS_TOKEN_SECRET, config_1.default.JWT_ACCESS_TOKEN_EXPIRES_IN);
    const refreshToken = (0, generateToken_1.default)(payload, config_1.default.JWT_REFRESH_TOKEN_SECRET, config_1.default.JWT_REFRESH_TOKEN_EXPIRES_IN);
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config_1.default.ENVIRONMENT === "production",
        sameSite: config_1.default.ENVIRONMENT === "production" ? "strict" : "lax",
        maxAge: parseInt(config_1.default.JWT_REFRESH_TOKEN_EXPIRES_IN) * 1000,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Login successful",
        data: {
            accessToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image || null,
            },
        },
    });
});
const OAuthCallback = (req, res) => {
    try {
        const user = req.user;
        const payload = {
            userId: user._id.toString(),
            role: user.role,
        };
        // Generate access token
        const accessToken = (0, generateToken_1.default)(payload, config_1.default.JWT_ACCESS_TOKEN_SECRET, config_1.default.JWT_ACCESS_TOKEN_EXPIRES_IN);
        // Generate refresh token
        const refreshToken = (0, generateToken_1.default)(payload, config_1.default.JWT_REFRESH_TOKEN_SECRET, config_1.default.JWT_REFRESH_TOKEN_EXPIRES_IN);
        // Set refresh token in cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: config_1.default.ENVIRONMENT === "production",
            sameSite: config_1.default.ENVIRONMENT === "production" ? "strict" : "lax",
            maxAge: parseInt(config_1.default.JWT_REFRESH_TOKEN_EXPIRES_IN) * 1000,
        });
        // Send access token + user info
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Login successful",
            data: {
                accessToken,
                user: {
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                },
            },
        });
    }
    catch (error) {
        console.error("OAuth Callback Error:", error);
        res.status(500).json({ success: false, message: "OAuth login failed" });
    }
};
// 6. Logout
const Logout = (0, catchAsync_1.default)(async (req, res, next) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 0,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Logout successful",
        data: null,
    });
});
// // 7. Get user profile
// const getUserProfile = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.userId; // Assuming you have middleware to set req.user
//     const user: IUser | null = await userModel
//       .findById(userId)
//       .select("-password");
//     if (!user) {
//       throw new AppError(status.NOT_FOUND, "User not found");
//     }
//     sendResponse(res, {
//       statusCode: status.OK,
//       success: true,
//       message: "User profile fetched successfully",
//       data: user,
//     });
//   }
// );
// // 8. Update user profile
// const updateUserProfile = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.userId; // Assuming you have middleware to set req.user
//     const updatedUser: IUser | null = await userModel.findByIdAndUpdate(
//       userId,
//       req.body,
//       { new: true }
//     );
//     if (!updatedUser) {
//       throw new AppError(status.NOT_FOUND, "User not found");
//     }
//     sendResponse(res, {
//       statusCode: status.OK,
//       success: true,
//       message: "User profile updated successfully",
//       data: updatedUser,
//     });
//   }
// );
// // 9. Delete user profile
// const deleteUserProfile = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.userId; // Assuming you have middleware to set req.user
//     const deletedUser: IUser | null = await userModel.findByIdAndDelete(userId);
//     if (!deletedUser) {
//       throw new AppError(status.NOT_FOUND, "User not found");
//     }
//     sendResponse(res, {
//       statusCode: status.OK,
//       success: true,
//       message: "User profile deleted successfully",
//       data: null,
//     });
//   }
// );
// // 10. Change password
// const changePassword = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.userId; // Assuming you have middleware to set req.user
//     const { oldPassword, newPassword } = req.body;
//     // Check if user exists
//     const user: IUser | null = await userModel
//       .findById(userId)
//       .select("+password");
//     if (!user) {
//       throw new AppError(status.NOT_FOUND, "User not found");
//     }
//     // Compare old password using bcrypt directly
//     const isMatch = await bcrypt.compare(oldPassword, user.user.password);
//     if (!isMatch) {
//       throw new AppError(status.UNAUTHORIZED, "Old password is incorrect");
//     }
//     // Update password
//     user.user.password = newPassword;
//     await userModel.updateOne({ _id: user._id }, { password: newPassword });
//     sendResponse(res, {
//       statusCode: status.OK,
//       success: true,
//       message: "Password changed successfully",
//       data: null,
//     });
//   }
// );
// // 11. Reset password
// // 12. Verify email
// const verifyEmail = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { email } = req.body;
//     // Check if user exists
//     const user: IUser | null = await userModel.findOne({ email });
//     if (!user) {
//       throw new AppError(status.NOT_FOUND, "User not found");
//     }
//     // Verify email logic here (e.g., send verification link)
//     sendResponse(res, {
//       statusCode: status.OK,
//       success: true,
//       message: "Email verification link sent",
//       data: null,
//     });
//   }
// );
// 13. Verify phone number
const verifyPhoneNumber = (0, catchAsync_1.default)(async (req, res, next) => {
    const { phoneNumber } = req.body;
    // Check if user exists
    const user = await users_model_1.userModel.findOne({ phoneNumber });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // Verify phone number logic here (e.g., send verification code)
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Phone number verification code sent",
        data: null,
    });
});
// 14. Resend verification email
const resendVerificationEmail = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email } = req.body;
    // Check if user exists
    const user = await users_model_1.userModel.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // Resend verification email logic here
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Verification email resent",
        data: null,
    });
});
// 15. Resend verification phone number
const resendVerificationPhoneNumber = (0, catchAsync_1.default)(async (req, res, next) => {
    const { phoneNumber } = req.body;
    // Check if user exists
    const user = await users_model_1.userModel.findOne({ phoneNumber });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // Resend verification phone number logic here
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Verification phone number resent",
        data: null,
    });
});
// 16. Verify phone number OTP
const verifyPhoneNumberOTP = (0, catchAsync_1.default)(async (req, res, next) => {
    const { phoneNumber, otp } = req.body;
    // Check if user exists
    const user = await users_model_1.userModel.findOne({ phoneNumber });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // Verify OTP logic here
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Phone number verified successfully",
        data: null,
    });
});
// 17. Verify email OTP
const verifyEmailOTP = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email, otp } = req.body;
    // Check if user exists
    const user = await users_model_1.userModel.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // Verify OTP logic here
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Email verified successfully",
        data: null,
    });
});
const approveRestaurantByAdmin = (0, catchAsync_1.default)(async (req, res) => {
    const email = req.body.email;
    const result = await auth_service_1.authService.approveRestaurantByAdmin(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Restaurant  approved successfully",
        data: result,
    });
});
exports.authController = {
    restuarantRegisterRequest,
    otpValidation,
    resendOtp,
    forgotPassword,
    verifyResetOtp,
    Login,
    OAuthCallback,
    Logout,
    // getUserProfile,
    // updateUserProfile,
    // deleteUserProfile,
    // changePassword,
    // verifyEmail,
    resetPassword,
    verifyPhoneNumber,
    resendVerificationEmail,
    resendVerificationPhoneNumber,
    verifyPhoneNumberOTP,
    verifyEmailOTP,
    approveRestaurantByAdmin
};
