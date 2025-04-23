import { Request, Response } from "express";
import { attributeService } from "./attribute.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const postAttribute = catchAsync(async (req: Request, res: Response) => {
  const result = await attributeService.postAttributeIntoDB(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Created successfully",
    data: result,
  });
});

const getAllAttribute = catchAsync(async (req: Request, res: Response) => {
  const result = await attributeService.getAllAttributeFromDB(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

const getSingleAttribute = catchAsync(async (req: Request, res: Response) => {
  const result = await attributeService.getSingleAttributeFromDB(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

const updateAttribute = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await attributeService.updateAttributeIntoDB(req.body, id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Updated successfully",
    data: result,
  });
});

const deleteAttribute = catchAsync(async (req: Request, res: Response) => {
  await attributeService.deleteAttributeFromDB(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Deleted successfully",
    data: null,
  });
});

export const attributeController = {
  postAttribute,
  getAllAttribute,
  getSingleAttribute,
  updateAttribute,
  deleteAttribute,
};
