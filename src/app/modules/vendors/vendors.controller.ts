import { Request, Response } from "express";
import { vendorsService } from "./vendors.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const postVendors = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorsService.postVendorsIntoDB(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Vendor request processed successfully",
    data: result,
  });
});

const getAllVendors = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorsService.getAllVendorsFromDB(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

const getSingleVendors = catchAsync(async (req: Request, res: Response) => {
  const result = await vendorsService.getSingleVendorsFromDB(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

const updateVendors = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await vendorsService.updateVendorsIntoDB(req.body, id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Updated successfully",
    data: result,
  });
});

const deleteVendors = catchAsync(async (req: Request, res: Response) => {
  await vendorsService.deleteVendorsFromDB(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Deleted successfully",
    data: null,
  });
});

export const vendorsController = {
  postVendors,
  getAllVendors,
  getSingleVendors,
  updateVendors,
  deleteVendors,
};
