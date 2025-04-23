import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import { usersModel } from "../users/users.model";
import { Iusers } from "../users/users.interface";
import AppError from "../../errors/AppError";
import comparePassword from "../../utils/comparePassword";
import generateToken from "../../utils/generateToken";

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
    // check if  user not exists:
    const user: Iusers | null = await usersModel.findOne({
      email: req.body.email,
    });
    if (!user) {
      throw new AppError(status.CONFLICT, "User not exists! please register");
    }

    // compare password:
    const isMatch = await comparePassword(req.body.password, user.password);

    if (!isMatch) {
      throw new AppError(status.UNAUTHORIZED, "Password is incorrect");
    }

    // generate token:
    const token = generateToken(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      process.env.JWT_EXPIRES_IN as unknown as number
    );

    // 3. Set token in cookie:
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: Number(process.env.JWT_EXPIRES_IN) * 1000, // Convert to milliseconds
    });

    // 4. Send response
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

export const authController = { Register, Login };
