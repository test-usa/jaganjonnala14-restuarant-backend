/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { carouselService } from "./carousel.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import { carouselModel } from "./carousel.model";
import fs from "fs";
import path from "path";

const create = catchAsync(async (req: Request, res: Response) => {
  const result = await carouselService.create({
    ...req.body,
    image: req.file ? req.file.path : undefined,
  });
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Created successfully",
    data: result,
  });
});

const deleteEntity = catchAsync(async (req: Request, res: Response) => {
  const carouselItem = await carouselModel.findOne({ _id: req.params.id });

  if (!carouselItem) {
    return sendResponse(res, {
      statusCode: status.NOT_FOUND,
      success: false,
      message: "Carousel not found",
      data: null,
    });
  }

  try {
    if (carouselItem.image) {
      const fileName = path.basename(carouselItem.image);
      const imagePath = path.join(process.cwd(), "uploads", fileName);

      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (err) {
          return sendResponse(res, {
            statusCode: status.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Error deleting carousel image file",
            data: null,
          });
        }
      } else {
        return sendResponse(res, {
          statusCode: status.NOT_FOUND,
          success: false,
          message: "Image file not found on server",
          data: null,
        });
      }
    }

    await carouselService.delete(req.params.id);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Carousel and associated image deleted successfully",
      data: null,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: status.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Unexpected error occurred",
      data: null,
    });
  }
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await carouselService.getAll(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

export const carouselController = {
  create,
  getAll,
  delete: deleteEntity,
};
