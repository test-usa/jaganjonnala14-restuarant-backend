import { Request, Response } from "express";
import { productsService } from "./products.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const postProducts = catchAsync(async (req: Request, res: Response) => {

  const result = await productsService.postProductsIntoDB(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Created successfully",
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await productsService.getAllProductsFromDB(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});
const getProductsByCategory = catchAsync(async (req: Request, res: Response) => {
  const categoryId = req.params.id
  const result = await productsService.getProductsByCategoryFromDB(req.query, categoryId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Product fetched successfully",
    data: result,
  });
});

const getSingleProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await productsService.getSingleProductsFromDB(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

const updateProducts = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await productsService.updateProductsIntoDB(req.body, id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Updated successfully",
    data: result,
  });
});

const deleteProducts = catchAsync(async (req: Request, res: Response) => {
  await productsService.deleteProductsFromDB(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Deleted successfully",
    data: null,
  });
});

export const productsController = {
  postProducts,
  getAllProducts,
  getSingleProducts,
  updateProducts,
  deleteProducts,
  
  getProductsByCategory
};
