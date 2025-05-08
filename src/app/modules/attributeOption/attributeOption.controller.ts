import { Request, Response } from "express";
import { attributeOptionService } from "./attributeOption.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const postAttributeOption = catchAsync(async (req: Request, res: Response) => {
  const result = await attributeOptionService.postAttributeOptionIntoDB(
    req.body
  );
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Created successfully",
    data: result,
  });
});

const getAllAttributeOption = catchAsync(
  async (req: Request, res: Response) => {
    const result = await attributeOptionService.getAllAttributeOptionFromDB(
      req.query
    );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Fetched successfully",
      data: result,
    });
  }
);

const getSingleAttributeOption = catchAsync(
  async (req: Request, res: Response) => {
    const result = await attributeOptionService.getSingleAttributeOptionFromDB(
      req.params.id
    );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Fetched successfully",
      data: result,
    });
  }
);

const updateAttributeOption = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await attributeOptionService.updateAttributeOptionIntoDB(
      req.body, id
    );
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Updated successfully",
      data: result,
    });
  }
);

const deleteAttributeOption = catchAsync(
  async (req: Request, res: Response) => {
    await attributeOptionService.deleteAttributeOptionFromDB(req.params.id);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Deleted successfully",
      data: null,
    });
  }
);

export const attributeOptionController = {
  postAttributeOption,
  getAllAttributeOption,
  getSingleAttributeOption,
  updateAttributeOption,
  deleteAttributeOption,
};
