import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { analyticService } from "./analytic.service";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";


const analytics = catchAsync(async (req: Request, res: Response) => {

    const id = req.params.id;

    const result = await analyticService.allAnalytic(id)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Restaurant deleted successfully",
        data: result,
      });
 
});

export const analyticController = {
    analytics
};
