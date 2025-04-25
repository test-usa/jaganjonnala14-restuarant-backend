import { Request, Response } from "express";
    import { employeeService } from "./employee.service";
    import catchAsync from "../../utils/catchAsync";
    import sendResponse from "../../utils/sendResponse";
    import status from "http-status";
    
    const postEmployee = catchAsync(async (req: Request, res: Response) => {
      const result = await employeeService.postEmployeeIntoDB(req.body);
      sendResponse(res, { statusCode: status.CREATED, success: true, message: "Created successfully", data: result });
    });
    
    const getAllEmployee = catchAsync(async (req: Request, res: Response) => {
      const result = await employeeService.getAllEmployeeFromDB(req.query);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const getSingleEmployee = catchAsync(async (req: Request, res: Response) => {
      const result = await employeeService.getSingleEmployeeFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const updateEmployee = catchAsync(async (req: Request, res: Response) => {
      const result = await employeeService.updateEmployeeIntoDB(req.body);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Updated successfully", data: result });
    });
    
    const deleteEmployee = catchAsync(async (req: Request, res: Response) => {
      await employeeService.deleteEmployeeFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Deleted successfully",data: null });
    });

    
    export const employeeController = { postEmployee, getAllEmployee, getSingleEmployee, updateEmployee, deleteEmployee };
    