import { Request, Response } from "express";
    import { restaurantTableService } from "./restaurantTable.service";
    import catchAsync from "../../utils/catchAsync";
    import sendResponse from "../../utils/sendResponse";
    import status from "http-status";
    
    const postRestaurantTable = catchAsync(async (req: Request, res: Response) => {
      const result = await restaurantTableService.postRestaurantTableIntoDB(req.body);
      sendResponse(res, { statusCode: status.CREATED, success: true, message: "Created successfully", data: result });
    });
    
    const getAllRestaurantTable = catchAsync(async (req: Request, res: Response) => {
      const result = await restaurantTableService.getAllRestaurantTableFromDB(req.query);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const getSingleRestaurantTable = catchAsync(async (req: Request, res: Response) => {
      const result = await restaurantTableService.getSingleRestaurantTableFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const updateRestaurantTable = catchAsync(async (req: Request, res: Response) => {
      const result = await restaurantTableService.updateRestaurantTableIntoDB(req.body);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Updated successfully", data: result });
    });
    
    const deleteRestaurantTable = catchAsync(async (req: Request, res: Response) => {
      await restaurantTableService.deleteRestaurantTableFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Deleted successfully",data: null });
    });

    
    export const restaurantTableController = { postRestaurantTable, getAllRestaurantTable, getSingleRestaurantTable, updateRestaurantTable, deleteRestaurantTable };
    