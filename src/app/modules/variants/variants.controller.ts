import { Request, Response } from "express";
import { variantsService } from "./variants.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import { variantsValidation } from "./variants.validation";

const create = catchAsync(async (req: Request, res: Response) => {
  const result = await variantsService.create(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Variant created successfully",
    data: result,
  });
});


const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await variantsService.getAll(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const result = await variantsService.getById(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const validatedData = variantsValidation.parse(req.body); // Zod validation
  const result = await variantsService.update(req.params.id, validatedData);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Updated successfully",
    data: result,
  });
});

const deleteEntity = catchAsync(async (req: Request, res: Response) => {
  await variantsService.delete(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Deleted successfully",
    data: null,
  });
});

const bulkDelete = catchAsync(async (req: Request, res: Response) => {
  const {ids} = req.body

  await variantsService.bulkDelete(ids);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Bulk delete successful",
    data: null,
  });
});

export const variantsController = {
  create,
  getAll,
  getById,
  update,
  delete: deleteEntity,
  bulkDelete,
};
