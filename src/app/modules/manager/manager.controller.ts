import { Request, Response } from "express";
    import { managerService } from "./manager.service";
    import catchAsync from "../../utils/catchAsync";
    import sendResponse from "../../utils/sendResponse";
    import status from "http-status";
    
    const postManager = catchAsync(async (req: Request, res: Response) => {
      const result = await managerService.postManagerIntoDB(req.body);
      sendResponse(res, { statusCode: status.CREATED, success: true, message: "Created successfully", data: result });
    });
    
    const getAllManager = catchAsync(async (req: Request, res: Response) => {
      const result = await managerService.getAllManagerFromDB(req.query);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const getSingleManager = catchAsync(async (req: Request, res: Response) => {
      const result = await managerService.getSingleManagerFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const updateManager = catchAsync(async (req: Request, res: Response) => {
      const result = await managerService.updateManagerIntoDB(req.body);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Updated successfully", data: result });
    });
    
    const deleteManager = catchAsync(async (req: Request, res: Response) => {
      await managerService.deleteManagerFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Deleted successfully",data: null });
    });

    
    export const managerController = { postManager, getAllManager, getSingleManager, updateManager, deleteManager };
    