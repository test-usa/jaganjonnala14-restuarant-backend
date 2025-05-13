import { Request, Response } from "express";
import { staffService } from "./staff.service";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import status from "http-status";

const postStaff = catchAsync(async (req: Request, res: Response) => {
  const result = await staffService.postStaffIntoDB(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Created successfully",
    data: result,
  });
});

const getAllStaff = catchAsync(async (req: Request, res: Response) => {
  const result = await staffService.getAllStaffFromDB(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

const getSingleStaff = catchAsync(async (req: Request, res: Response) => {
  const result = await staffService.getSingleStaffFromDB(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

const updateStaff = catchAsync(async (req: Request, res: Response) => {
  const result = await staffService.updateStaffIntoDB(req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Updated successfully",
    data: result,
  });
});

const deleteStaff = catchAsync(async (req: Request, res: Response) => {
  await staffService.deleteStaffFromDB(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Deleted successfully",
    data: null,
  });
});

export const staffController = {
  postStaff,
  getAllStaff,
  getSingleStaff,
  updateStaff,
  deleteStaff,
};
