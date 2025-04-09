/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { usersService } from "./users.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import jwt from "jsonwebtoken";
import config from "../../config";
const create = catchAsync(async (req: Request, res: Response) => {
  const result = await usersService.create(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Registration successfully",
    data: result,
  });
});
const adminRegistration = catchAsync(async (req: Request, res: Response) => {
  const result = await usersService.adminRegistration(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Admin registration successfully",
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await usersService.login(req.body);

  if (!config.jwt_access_secret) {
    throw new Error("JWT access secret is not defined in the configuration.");
  }
  const token = jwt.sign(
    { id: result._id, role: result.role },
    config.jwt_access_secret,
    { expiresIn: "60d" }
  );

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Login successfully",
    data: {
      token,
      user: result,
    },
  });
});
const adminLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await usersService.adminLogin(req.body);

  if (!config.jwt_access_secret) {
    throw new Error("JWT access secret is not defined in the configuration.");
  }
  const token = jwt.sign(
    { id: result._id, role: result.role },
    config.jwt_access_secret,
    { expiresIn: "2d" }
  );
  const { password, ...userWithoutPassword } = result.toObject ? result.toObject() : result;

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Admin login successfully",
    data: {
      token,
      user: userWithoutPassword,
    },
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await usersService.getAll(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const result = await usersService.getById(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const result = await usersService.update(req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Updated successfully",
    data: result,
  });
});

const deleteEntity = catchAsync(async (req: Request, res: Response) => {
  await usersService.delete(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Deleted successfully",
    data: null,
  });
});

const bulkDelete = catchAsync(async (req: Request, res: Response) => {
  const ids: string[] = req.body.ids; // Expecting an array of IDs to be passed for bulk delete
  if (!Array.isArray(ids) || ids.length === 0) {
    return sendResponse(res, {
      statusCode: status.BAD_REQUEST,
      success: false,
      message: "Invalid IDs array",
      data: null,
    });
  }
  await usersService.bulkDelete(ids);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Bulk delete successful",
    data: null,
  });
});

export const usersController = {
  create,
  getAll,
  getById,
  update,
  delete: deleteEntity,
  bulkDelete,
  login,
  adminRegistration,
  adminLogin,
};
