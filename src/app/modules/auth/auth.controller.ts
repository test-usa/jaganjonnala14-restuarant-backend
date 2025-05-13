import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

import AppError from "../../errors/AppError";
import generateToken from "../../utils/generateToken";
import bcrypt from "bcryptjs";
import config from "../../config";
import { IUser } from "../users/user/users.interface";
import { userModel } from "../users/user/users.model";
import { authService } from "./auth.service";
import { OwnerModel } from "../users/owner/owner.model";
import { RESTAURANT_STATUS } from "../restuarant/restuarant.constant";

const restuarantRegisterRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const pendingRestuarant = await authService.restuarantRegisterRequestIntoDB(
      req.body
    );
    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: "An OTP has been sent to your email and phone for verification.",
      data: pendingRestuarant,
    });
  }
);

const otpValidation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userEmail = req.query.email as string;
    await authService.otpValidationIntoDB(
      req.body, userEmail
    );
    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: "OTP verified. Your account is now pending admin approval.",
      data: null,
    });
  }
);


const Login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user: IUser | null = await userModel
      .findOne({ email: email })
      .select("+password");

    if (!user) {
      throw new AppError(status.CONFLICT, "User not exists! Please register");
    }

    const isRestaurantExistForThisUser: any = await OwnerModel.findOne({
      user: user._id,
    }).populate({
      path: "restaurant", // field in OwnerModel schema
      model: "Restaurant", // name of the Mongoose model
    });

    if (
      isRestaurantExistForThisUser &&
      isRestaurantExistForThisUser.restaurant.status != RESTAURANT_STATUS.ACTIVE
    ) {
      throw new Error(
        "You are not allowed to log in because your account is not yet active. Please wait for admin approval."
      );
    }

    // 2. Compare password using bcrypt directly
    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) {
      throw new AppError(status.UNAUTHORIZED, "Password is incorrect");
    }

    const payload = {
      userId: user._id,
      role: user.role,
    };

    //  Generate access token:

    const accessToken = generateToken(
      payload,
      config.JWT_ACCESS_TOKEN_SECRET!,
      config.JWT_ACCESS_TOKEN_EXPIRES_IN!
    );

    // generate refresh token:
    const refreshToken = generateToken(
      payload,
      config.JWT_REFRESH_TOKEN_SECRET!,
      config.JWT_REFRESH_TOKEN_EXPIRES_IN!
    );

    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.ENVIRONMENT === "production",
      sameSite: config.ENVIRONMENT === "production",
      maxAge: parseInt(config.JWT_REFRESH_TOKEN_EXPIRES_IN!) * 1000,
    });

    //  send access token and user info:

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  }
);

const OAuthCallback = (req: Request, res: Response) => {
  try {
    const user = req.user as any;

    const payload = {
      userId: user._id.toString(),
      role: user.role,
    };

    // Generate access token
    const accessToken = generateToken(
      payload,
      config.JWT_ACCESS_TOKEN_SECRET!,
      config.JWT_ACCESS_TOKEN_EXPIRES_IN!
    );

    // Generate refresh token
    const refreshToken = generateToken(
      payload,
      config.JWT_REFRESH_TOKEN_SECRET!,
      config.JWT_REFRESH_TOKEN_EXPIRES_IN!
    );

    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.ENVIRONMENT === "production",
      sameSite: config.ENVIRONMENT === "production" ? "strict" : "lax",
      maxAge: parseInt(config.JWT_REFRESH_TOKEN_EXPIRES_IN!) * 1000,
    });

    // Send access token + user info
    // return sendResponse(res, {
    //   statusCode: status.OK,
    //   success: true,
    //   message: "Login successful",
    //   data: {
    //     accessToken,
    //     user: {
    //       name: user.user?.fullName || user.name,
    //       email: user.user?.email || user.email,
    //       image: user.user?.image || user.image,
    //       role: user.role,
    //     },
    //   },
    // });

    // Or redirect if needed:
    res.redirect(
      `${process.env.FRONTEND_URL}/oauth-success?accessToken=${accessToken}`
    );
  } catch (error) {
    console.error("OAuth Callback Error:", error);
    res.status(500).json({ success: false, message: "OAuth login failed" });
  }
};
// 6. Logout
const Logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 0,
    });

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Logout successful",
      data: null,
    });
  }
);
// 7. Get user profile
const getUserProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId; // Assuming you have middleware to set req.user

    const user: IUser | null = await userModel
      .findById(userId)
      .select("-password");

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  }
);
// 8. Update user profile
const updateUserProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId; // Assuming you have middleware to set req.user

    const updatedUser: IUser | null = await userModel.findByIdAndUpdate(
      userId,
      req.body,
      { new: true }
    );

    if (!updatedUser) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "User profile updated successfully",
      data: updatedUser,
    });
  }
);
// 9. Delete user profile
const deleteUserProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId; // Assuming you have middleware to set req.user

    const deletedUser: IUser | null = await userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "User profile deleted successfully",
      data: null,
    });
  }
);
// 10. Change password
const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId; // Assuming you have middleware to set req.user

    const { oldPassword, newPassword } = req.body;

    // Check if user exists
    const user: IUser | null = await userModel
      .findById(userId)
      .select("+password");

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    // Compare old password using bcrypt directly
    const isMatch = await bcrypt.compare(oldPassword, user.user.password);
    if (!isMatch) {
      throw new AppError(status.UNAUTHORIZED, "Old password is incorrect");
    }

    // Update password
    user.user.password = newPassword;
    await userModel.updateOne({ _id: user._id }, { password: newPassword });

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Password changed successfully",
      data: null,
    });
  }
);
// 11. Reset password
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, newPassword } = req.body;

    // Check if user exists
    const user: IUser | null = await userModel
      .findOne({ email })
      .select("+password");

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    // Update password
    user.password = newPassword;
    await userModel.updateOne({ _id: user._id }, { password: newPassword });

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Password reset successfully",
      data: null,
    });
  }
);
// 12. Verify email
const verifyEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    // Check if user exists
    const user: IUser | null = await userModel.findOne({ email });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    // Verify email logic here (e.g., send verification link)

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Email verification link sent",
      data: null,
    });
  }
);
// 13. Verify phone number
const verifyPhoneNumber = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber } = req.body;

    // Check if user exists
    const user: IUser | null = await userModel.findOne({ phoneNumber });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    // Verify phone number logic here (e.g., send verification code)

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Phone number verification code sent",
      data: null,
    });
  }
);
// 14. Resend verification email
const resendVerificationEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    // Check if user exists
    const user: IUser | null = await userModel.findOne({ email });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    // Resend verification email logic here

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Verification email resent",
      data: null,
    });
  }
);
// 15. Resend verification phone number
const resendVerificationPhoneNumber = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber } = req.body;

    // Check if user exists
    const user: IUser | null = await userModel.findOne({ phoneNumber });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    // Resend verification phone number logic here

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Verification phone number resent",
      data: null,
    });
  }
);
// 16. Verify phone number OTP
const verifyPhoneNumberOTP = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber, otp } = req.body;

    // Check if user exists
    const user: IUser | null = await userModel.findOne({ phoneNumber });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    // Verify OTP logic here

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Phone number verified successfully",
      data: null,
    });
  }
);
// 17. Verify email OTP
const verifyEmailOTP = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;

    // Check if user exists
    const user: IUser | null = await userModel.findOne({ email });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    // Verify OTP logic here

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Email verified successfully",
      data: null,
    });
  }
);

export const authController = {
  restuarantRegisterRequest,
  otpValidation,
  Login,
  OAuthCallback,
  Logout,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  changePassword,
  resetPassword,
  verifyEmail,
  verifyPhoneNumber,
  resendVerificationEmail,
  resendVerificationPhoneNumber,
  verifyPhoneNumberOTP,
  verifyEmailOTP,
};
