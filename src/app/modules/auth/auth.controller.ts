import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import { usersModel } from "../users/users.model";
import { Iusers } from "../users/users.interface";
import AppError from "../../errors/AppError";
import generateToken from "../../utils/generateToken";
import bcrypt from "bcryptjs";

const Register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // check if user already exists:
    const user: Iusers | null = await usersModel.findOne({
      email: req.body.email,
    });
    if (user) {
      throw new AppError(status.CONFLICT, "User already exists");
    }

    // create user:
    const newUser = await usersModel.create(req.body);
    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: "Register successfully",
      data: newUser,
    });
  }
);

const Login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user: Iusers | null = await usersModel
      .findOne({ email })
      .select("+password");

    if (!user) {
      throw new AppError(status.CONFLICT, "User not exists! Please register");
    }

    // 2. Compare password using bcrypt directly
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError(status.UNAUTHORIZED, "Password is incorrect");
    }

    // 3. Generate token
    const token = generateToken(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      process.env.JWT_EXPIRES_IN as unknown as number
    );

    // 4. Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: parseInt(process.env.JWT_EXPIRES_IN as string) * 1000,
    });

    // 5. Send response
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  }
);

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
    const userId = req.user.userId; // Assuming you have middleware to set req.user

    const user: Iusers | null = await usersModel
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
    const userId = req.user.userId; // Assuming you have middleware to set req.user

    const updatedUser: Iusers | null = await usersModel.findByIdAndUpdate(
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
    const userId = req.user.userId; // Assuming you have middleware to set req.user

    const deletedUser: Iusers | null = await usersModel.findByIdAndDelete(
      userId
    );

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
    const userId = req.user.userId; // Assuming you have middleware to set req.user

    const { oldPassword, newPassword } = req.body;

    // Check if user exists
    const user: Iusers | null = await usersModel
      .findById(userId)
      .select("+password");

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    // Compare old password using bcrypt directly
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new AppError(status.UNAUTHORIZED, "Old password is incorrect");
    }

    // Update password
    user.password = newPassword;
    await usersModel.updateOne({ _id: user._id }, { password: newPassword });

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
    const user: Iusers | null = await usersModel
      .findOne({ email })
      .select("+password");

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    // Update password
    user.password = newPassword;
    await usersModel.updateOne({ _id: user._id }, { password: newPassword });

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
    const user: Iusers | null = await usersModel.findOne({ email });

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
    const user: Iusers | null = await usersModel.findOne({ phoneNumber });

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
    const user: Iusers | null = await usersModel.findOne({ email });

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
    const user: Iusers | null = await usersModel.findOne({ phoneNumber });

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
    const user: Iusers | null = await usersModel.findOne({ phoneNumber });

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
    const user: Iusers | null = await usersModel.findOne({ email });

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
  Register,
  Login,
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
