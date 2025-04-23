import { Request, Response } from "express";
import { categoriesService } from "./categories.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const postCategories = catchAsync(async (req: Request, res: Response) => {

  const result = await categoriesService.postCategoriesIntoDB(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Created successfully",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await categoriesService.getAllCategoriesFromDB(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

const getSingleCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await categoriesService.getSingleCategoriesFromDB(
    req.params.id
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

const updateCategories = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await categoriesService.updateCategoriesIntoDB(req.body, id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Updated successfully",
    data: result,
  });
});

const deleteCategories = catchAsync(async (req: Request, res: Response) => {
  await categoriesService.deleteCategoriesFromDB(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Deleted successfully",
    data: null,
  });
});

export const categoriesController = {
  postCategories,
  getAllCategories,
  getSingleCategories,
  updateCategories,
  deleteCategories,
};
