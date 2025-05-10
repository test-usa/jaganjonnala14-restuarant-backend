import { Request, Response } from "express";
    import { orderService } from "./order.service";
    import catchAsync from "../../utils/catchAsync";
    import sendResponse from "../../utils/sendResponse";
    import status from "http-status";
    
    const postOrder = catchAsync(async (req: Request, res: Response) => {
      const result = await orderService.postOrderIntoDB(req.body);
      sendResponse(res, { statusCode: status.CREATED, success: true, message: "Created successfully", data: result });
    });
    
    const getAllOrder = catchAsync(async (req: Request, res: Response) => {
      const result = await orderService.getAllOrderFromDB(req.query);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
      const result = await orderService.getSingleOrderFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const updateOrder = catchAsync(async (req: Request, res: Response) => {
      const result = await orderService.updateOrderIntoDB(req.body);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Updated successfully", data: result });
    });
    
    const deleteOrder = catchAsync(async (req: Request, res: Response) => {
      await orderService.deleteOrderFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Deleted successfully",data: null });
    });

    
    export const orderController = { postOrder, getAllOrder, getSingleOrder, updateOrder, deleteOrder };
    