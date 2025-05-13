import { Request, Response } from "express";
    import { restuarantService } from "./restuarant.service";
    import catchAsync from "../../utils/catchAsync";
    import sendResponse from "../../utils/sendResponse";
    import status from "http-status";
    
    const postRestuarant = catchAsync(async (req: Request, res: Response) => {
      const result = await restuarantService.postRestuarantIntoDB(req.body);
      sendResponse(res, { statusCode: status.CREATED, success: true, message: "Created successfully", data: result });
    });
    
    const getAllRestuarant = catchAsync(async (req: Request, res: Response) => {
      const result = await restuarantService.getAllRestuarantFromDB(req.query);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const getSingleRestuarant = catchAsync(async (req: Request, res: Response) => {
      const result = await restuarantService.getSingleRestuarantFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const updateRestuarant = catchAsync(async (req: Request, res: Response) => {
      const result = await restuarantService.updateRestuarantIntoDB(req.body);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Updated successfully", data: result });
    });
    
    const deleteRestuarant = catchAsync(async (req: Request, res: Response) => {
      await restuarantService.deleteRestuarantFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Deleted successfully",data: null });
    });

    
    export const restuarantController = { postRestuarant, getAllRestuarant, getSingleRestuarant, updateRestuarant, deleteRestuarant };
    