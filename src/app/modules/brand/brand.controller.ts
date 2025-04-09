// brand.controller.ts - brand module
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { brandServcies } from "./brand.service";
import { BrandModel } from "./brand.model";
import path from "path";
import fs from "fs";

// brand.controller.ts - brand module
const postbrand = catchAsync(async (req, res) => {
  // Extract image file paths from uploaded files

  // Create the brand in the database
  const result = await brandServcies.createbrandIntoDB({
    ...req.body,
    image: req.file ? req.file.path : undefined,
  });

  // Send success response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "brand created successfully",
    data: result,
  });
});

const getbrands = catchAsync(async (req, res) => {
  const result = await brandServcies.getAllbrandsFromDB(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "All brands fetched successfully",
    data: result,
  });
});

const getbrandById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = brandServcies.getbrandByIdFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "brand fetched successfully",
    data: result,
  });
});

const updatebrand = catchAsync(async (req, res) => {
  const { id } = req.params;
  const new_file_path = req.file ? req.file.path : undefined; // নতুন ফাইল থাকলে সেট করো

  // ID দিয়ে ডাটাবেজ থেকে ব্র্যান্ড খোঁজা
  const findExistingDataById = await BrandModel.findById(id);

  if (!findExistingDataById) {
    return sendResponse(res, {
      statusCode: status.NOT_FOUND,
      success: false,
      message: "Brand not found",
      data: null,
    });
  }

  const old_file_name = findExistingDataById.image
    ? path.basename(findExistingDataById.image)
    : null;

  const old_file_path = old_file_name
    ? path.join(__dirname, "../../../../uploads", old_file_name)
    : null;

  // যদি নতুন ফাইল থাকে, তাহলে পুরানো ফাইল ডিলিট করো
  if (new_file_path && old_file_path && fs.existsSync(old_file_path)) {
    try {
      fs.unlinkSync(old_file_path);
    } catch (error) {
      console.error("Error deleting old file:", error);
    }
  }

  // ব্র্যান্ড আপডেট করা
  const result = await brandServcies.updatebrandInDB({
    id,
    ...req.body,
    image: new_file_path || findExistingDataById.image, // নতুন ইমেজ না থাকলে আগেরটাই রাখো
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Brand updated successfully",
    data: result,
  });
});


const deletebrand = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = brandServcies.deletebrandFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "brand deleted successfully",
    data: result,
  });
});

const BulkDelete = catchAsync(async (req, res) => {
  const { ids } = req.body;
  const result = brandServcies.bulkSoftDeleteFromDB(ids);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "brand deleted successfully",
    data: result,
  });
});




export const brandController = {
  postbrand,
  getbrands,
  getbrandById,
  updatebrand,
  deletebrand,
  BulkDelete
};
