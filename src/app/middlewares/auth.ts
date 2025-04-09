import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { TUserRole } from "../utils/interfaces";
import AppError from "../errors/AppError";
import status from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { usersModel } from "../modules/users/users.model";


const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
  
    // checking if the token is missing
    if (!token) {
      throw new AppError(status.UNAUTHORIZED, "You are not authorized!");
    }
    // checking if the given token is valid
    const decoded = jwt.verify(token, config.jwt_access_secret as string);

    const { id, role } = decoded as JwtPayload;
    const user = await usersModel.findById(id);
    if (!user) {
      throw new AppError(status.NOT_FOUND, "This user is not found, please register again!");
    }




    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(status.UNAUTHORIZED, "You are not authorized  hi!");
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
