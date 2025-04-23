import { Request, Response } from "express";
    import { adminService } from "./admin.service";
    import catchAsync from "../../utils/catchAsync";
    import sendResponse from "../../utils/sendResponse";
    import status from "http-status";
    
    const postAdmin = catchAsync(async (req: Request, res: Response) => {
      const result = await adminService.postAdminIntoDB(req.body);
      sendResponse(res, { statusCode: status.CREATED, success: true, message: "Created successfully", data: result });
    });
    
    const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
      const result = await adminService.getAllAdminFromDB(req.query);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const getSingleAdmin = catchAsync(async (req: Request, res: Response) => {
      const result = await adminService.getSingleAdminFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const updateAdmin = catchAsync(async (req: Request, res: Response) => {
      const result = await adminService.updateAdminIntoDB(req.body);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Updated successfully", data: result });
    });
    
    const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
      await adminService.deleteAdminFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Deleted successfully",data: null });
    });


    const createManager = catchAsync(async (req: Request, res: Response) => {
      await adminService.createManagerIntoDB(req.body);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Manager created successfully",data: null });
    });

    
    export const adminController = { postAdmin, getAllAdmin, getSingleAdmin, updateAdmin, deleteAdmin , createManager };
    