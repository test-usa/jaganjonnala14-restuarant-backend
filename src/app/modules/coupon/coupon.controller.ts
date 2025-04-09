import { Request, Response } from "express";
import { couponService } from "./coupon.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const create = catchAsync(async (req: Request, res: Response) => {
  const result = await couponService.create(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Created successfully",
    data: result,
  });
});
const couponApply = catchAsync(async (req: Request, res: Response) => {
  const result = await couponService.couponApply(req.body, req?.user?.id);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Coupon apply successfully",
    data: result,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await couponService.getAll(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const result = await couponService.getById(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await couponService.update(req.body, id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Updated successfully",
    data: result,
  });
});

const deleteEntity = catchAsync(async (req: Request, res: Response) => {

  await couponService.delete(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Deleted successfully",
    data: null,
  });
});



export const couponController = {
  create,
  getAll,
  getById,
  update,
  delete: deleteEntity,
  couponApply
};
