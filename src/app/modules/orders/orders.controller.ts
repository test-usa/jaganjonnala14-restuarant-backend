import { Request, Response } from "express";
    import { ordersService } from "./orders.service";
    import catchAsync from "../../utils/catchAsync";
    import sendResponse from "../../utils/sendResponse";
    import status from "http-status";
    
    const postOrders = catchAsync(async (req: Request, res: Response) => {
      const result = await ordersService.postOrdersIntoDB(req.body);
      sendResponse(res, { statusCode: status.CREATED, success: true, message: "Created successfully", data: result });
    });
    
    const getAllOrders = catchAsync(async (req: Request, res: Response) => {
      const result = await ordersService.getAllOrdersFromDB(req.query);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const getSingleOrders = catchAsync(async (req: Request, res: Response) => {
      const result = await ordersService.getSingleOrdersFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const updateOrders = catchAsync(async (req: Request, res: Response) => {
      const result = await ordersService.updateOrdersIntoDB(req.body);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Updated successfully", data: result });
    });
    
    const deleteOrders = catchAsync(async (req: Request, res: Response) => {
      await ordersService.deleteOrdersFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Deleted successfully",data: null });
    });

    
    export const ordersController = { postOrders, getAllOrders, getSingleOrders, updateOrders, deleteOrders };
    