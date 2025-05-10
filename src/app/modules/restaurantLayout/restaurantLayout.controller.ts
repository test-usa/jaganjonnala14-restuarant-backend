import { Request, Response } from "express";
    import { restaurantLayoutService } from "./restaurantLayout.service";
    import catchAsync from "../../utils/catchAsync";
    import sendResponse from "../../utils/sendResponse";
    import status from "http-status";
    
    const postRestaurantLayout = catchAsync(async (req: Request, res: Response) => {
      const result = await restaurantLayoutService.postRestaurantLayoutIntoDB(req.body);
      sendResponse(res, { statusCode: status.CREATED, success: true, message: "Created successfully", data: result });
    });
    
    const getAllRestaurantLayout = catchAsync(async (req: Request, res: Response) => {
      const result = await restaurantLayoutService.getAllRestaurantLayoutFromDB(req.query);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const getSingleRestaurantLayout = catchAsync(async (req: Request, res: Response) => {
      const result = await restaurantLayoutService.getSingleRestaurantLayoutFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const updateRestaurantLayout = catchAsync(async (req: Request, res: Response) => {
      const result = await restaurantLayoutService.updateRestaurantLayoutIntoDB(req.body);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Updated successfully", data: result });
    });
    
    const deleteRestaurantLayout = catchAsync(async (req: Request, res: Response) => {
      await restaurantLayoutService.deleteRestaurantLayoutFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Deleted successfully",data: null });
    });

    
    export const restaurantLayoutController = { postRestaurantLayout, getAllRestaurantLayout, getSingleRestaurantLayout, updateRestaurantLayout, deleteRestaurantLayout };
    