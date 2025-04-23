import { Request, Response } from "express";
    import { customerService } from "./customer.service";
    import catchAsync from "../../utils/catchAsync";
    import sendResponse from "../../utils/sendResponse";
    import status from "http-status";
    
    const postCustomer = catchAsync(async (req: Request, res: Response) => {
      const result = await customerService.postCustomerIntoDB(req.body);
      sendResponse(res, { statusCode: status.CREATED, success: true, message: "Created successfully", data: result });
    });
    
    const getAllCustomer = catchAsync(async (req: Request, res: Response) => {
      const result = await customerService.getAllCustomerFromDB(req.query);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const getSingleCustomer = catchAsync(async (req: Request, res: Response) => {
      const result = await customerService.getSingleCustomerFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const updateCustomer = catchAsync(async (req: Request, res: Response) => {
      const result = await customerService.updateCustomerIntoDB(req.body);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Updated successfully", data: result });
    });
    
    const deleteCustomer = catchAsync(async (req: Request, res: Response) => {
      await customerService.deleteCustomerFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Deleted successfully",data: null });
    });

    
    export const customerController = { postCustomer, getAllCustomer, getSingleCustomer, updateCustomer, deleteCustomer };
    