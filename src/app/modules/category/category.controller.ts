import { Request, Response } from "express";
    import { categoryService } from "./category.service";
    import catchAsync from "../../utils/catchAsync";
    import sendResponse from "../../utils/sendResponse";
    import status from "http-status";
    
    const postCategory = catchAsync(async (req: Request, res: Response) => {
      const result = await categoryService.postCategoryIntoDB(req.body);
      sendResponse(res, { statusCode: status.CREATED, success: true, message: "Created successfully", data: result });
    });
    
    const getAllCategory = catchAsync(async (req: Request, res: Response) => {
      const result = await categoryService.getAllCategoryFromDB(req.query);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
      const result = await categoryService.getSingleCategoryFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const updateCategory = catchAsync(async (req: Request, res: Response) => {
      const result = await categoryService.updateCategoryIntoDB(req.body);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Updated successfully", data: result });
    });
    
    const deleteCategory = catchAsync(async (req: Request, res: Response) => {
      await categoryService.deleteCategoryFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Deleted successfully",data: null });
    });

    
    export const categoryController = { postCategory, getAllCategory, getSingleCategory, updateCategory, deleteCategory };
    