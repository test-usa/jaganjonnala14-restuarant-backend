/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { categoryServices } from "./categories.service";
import categoryModel from "./categories.model";
import path from "path";
import fs from "fs";

const postCategory = catchAsync(async (req, res) => {
  const data = req.body;

  const result = await categoryServices.postCategoryIntoDB(data);

  // Send a success response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category is created succesfully.",
    data: result,
  });
});

const getCategory = catchAsync(async (req, res) => {
  const result = await categoryServices.getCategoriesIntoDB(req.query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category is get succesfully.",
    data: result,
  });
});
const getCategoryForSidebar = catchAsync(async (req, res) => {
  const result = await categoryServices.getCategoriesForSidebarIntoDB(
    req.query
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category is get succesfully.",
    data: result,
  });
});

const putCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  const Category = await categoryModel.findOne({ _id: id });

  if (!Category) {
    return sendResponse(res, {
      statusCode: status.NOT_FOUND,
      success: false,
      message: "Category not found",
      data: null,
    });
  }

  if (req.body.image.trim() === "") {
    req.body.image = Category.image;
  } else {
    const oldImagePath = path.join(
      __dirname,
      "../../../../uploads",
      path.basename(Category.image as string)
    );

    if (fs.existsSync(oldImagePath)) {
      try {
        fs.unlinkSync(oldImagePath);
      } catch (error: any) {
        throw new Error(`Error deleting old feature image: ${error.message}`);
      }
    }
  }

  const result = await categoryServices.putCategoryIntoDB({
    id,
    ...req.body,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category is edited successfully.",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = categoryServices.deleteCategoryIntoDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category deleted successfully",
    data: result,
  });
});
const bulkDeleteCategory = catchAsync(async (req, res) => {
  const { ids } = req.body;
  const result = categoryServices.deleteBulkCategoryIntoDB(ids);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category bulk deleted successfully",
    data: result,
  });
});

export const categoryController = {
  postCategory,
  getCategory,
  putCategory,
  deleteCategory,
  bulkDeleteCategory,
  getCategoryForSidebar,
};
