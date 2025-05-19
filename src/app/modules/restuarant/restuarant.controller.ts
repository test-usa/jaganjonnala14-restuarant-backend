import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { restaurantService } from "./restuarant.service";
import { IRestaurant } from "./restuarant.interface";
import { uploadImgToCloudinary, uploadMultipleImages } from "../../utils/sendImageToCloudinary";


const postRestuarant = catchAsync(async (req: Request, res: Response) => {

  const data = JSON.parse(req.body.data);

  const files = (req.files as any)?.images?.map((file: Express.Multer.File) => file.path);
  const uploadLogo = (req.files as any)?.logo?.[0]?.path;

  const {  secure_url} = await uploadImgToCloudinary("logo",uploadLogo)
  const uploadedImages = await uploadMultipleImages(files);
  const {images,coverPhoto,logo,...rest} =  data;
  const restaurantData = {images:uploadedImages,logo:secure_url,coverPhoto:uploadedImages[0],...rest}
  
  const result = await restaurantService.postRestaurant(restaurantData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Restaurant created successfully",
    data: result,
  });
});


const getAllRestuarant = catchAsync(async (_req: Request, res: Response) => {
  const result = await restaurantService.getAllRestaurant();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Restaurants retrieved successfully",
    data: result,
  });
});

const getSingleRestuarant = catchAsync(async (req: Request, res: Response) => {
  const result = await restaurantService.getSingleRestaurant(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Restaurant retrieved successfully",
    data: result,
  });
});

const updateRestuarant = catchAsync(async (req: Request, res: Response) => {
  const result = await restaurantService.updateRestaurant(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Restaurant updated successfully",
    data: result,
  });
});

const deleteRestuarant = catchAsync(async (req: Request, res: Response) => {
  const result = await restaurantService.deleteRestaurant(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Restaurant deleted successfully",
    data: result,
  });
});

export const restuarantController = {
  postRestuarant,
  getAllRestuarant,
  getSingleRestuarant,
  updateRestuarant,
  deleteRestuarant,
};
