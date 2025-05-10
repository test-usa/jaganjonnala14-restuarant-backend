import { Request, Response } from "express";
    import { restaurantTableSettingService } from "./restaurantTableSetting.service";
    import catchAsync from "../../utils/catchAsync";
    import sendResponse from "../../utils/sendResponse";
    import status from "http-status";
    
    const postRestaurantTableSetting = catchAsync(async (req: Request, res: Response) => {
      const result = await restaurantTableSettingService.postRestaurantTableSettingIntoDB(req.body);
      sendResponse(res, { statusCode: status.CREATED, success: true, message: "Created successfully", data: result });
    });
    
    const getAllRestaurantTableSetting = catchAsync(async (req: Request, res: Response) => {
      const result = await restaurantTableSettingService.getAllRestaurantTableSettingFromDB(req.query);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const getSingleRestaurantTableSetting = catchAsync(async (req: Request, res: Response) => {
      const result = await restaurantTableSettingService.getSingleRestaurantTableSettingFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const updateRestaurantTableSetting = catchAsync(async (req: Request, res: Response) => {
      const result = await restaurantTableSettingService.updateRestaurantTableSettingIntoDB(req.body);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Updated successfully", data: result });
    });
    
    const deleteRestaurantTableSetting = catchAsync(async (req: Request, res: Response) => {
      await restaurantTableSettingService.deleteRestaurantTableSettingFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Deleted successfully",data: null });
    });

    
    export const restaurantTableSettingController = { postRestaurantTableSetting, getAllRestaurantTableSetting, getSingleRestaurantTableSetting, updateRestaurantTableSetting, deleteRestaurantTableSetting };
    