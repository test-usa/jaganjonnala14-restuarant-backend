import { Request, Response } from "express";
    import { menuService } from "./menu.service";
    import catchAsync from "../../utils/catchAsync";
    import sendResponse from "../../utils/sendResponse";
    import status from "http-status";
    
    const postMenu = catchAsync(async (req: Request, res: Response) => {
      const result = await menuService.postMenuIntoDB(req.body);
      sendResponse(res, { statusCode: status.CREATED, success: true, message: "Created successfully", data: result });
    });
    
    const getAllMenu = catchAsync(async (req: Request, res: Response) => {
      const result = await menuService.getAllMenuFromDB(req.query);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const getSingleMenu = catchAsync(async (req: Request, res: Response) => {
      const result = await menuService.getSingleMenuFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const updateMenu = catchAsync(async (req: Request, res: Response) => {
      const result = await menuService.updateMenuIntoDB(req.body);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Updated successfully", data: result });
    });
    
    const deleteMenu = catchAsync(async (req: Request, res: Response) => {
      await menuService.deleteMenuFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Deleted successfully",data: null });
    });

    
    export const menuController = { postMenu, getAllMenu, getSingleMenu, updateMenu, deleteMenu };
    