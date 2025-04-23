import { Request, Response } from "express";
    import { usersService } from "./users.service";
    import catchAsync from "../../utils/catchAsync";
    import sendResponse from "../../utils/sendResponse";
    import status from "http-status";
    
    const postUsers = catchAsync(async (req: Request, res: Response) => {
      const result = await usersService.postUsersIntoDB(req.body);
      sendResponse(res, { statusCode: status.CREATED, success: true, message: "Created successfully", data: result });
    });
    
    const getAllUsers = catchAsync(async (req: Request, res: Response) => {
      const result = await usersService.getAllUsersFromDB(req.query);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const getSingleUsers = catchAsync(async (req: Request, res: Response) => {
      const result = await usersService.getSingleUsersFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
    });
    
    const updateUsers = catchAsync(async (req: Request, res: Response) => {
      const result = await usersService.updateUsersIntoDB(req.body);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Updated successfully", data: result });
    });
    
    const deleteUsers = catchAsync(async (req: Request, res: Response) => {
      await usersService.deleteUsersFromDB(req.params.id);
      sendResponse(res, { statusCode: status.OK, success: true, message: "Deleted successfully",data: null });
    });

    
    export const usersController = { postUsers, getAllUsers, getSingleUsers, updateUsers, deleteUsers };
    