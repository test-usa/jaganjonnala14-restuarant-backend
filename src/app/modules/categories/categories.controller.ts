import status from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { categoryServices } from "./categories.service";

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
  const result = await categoryServices.getCategoriesForSidebarIntoDB(req.query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category is get succesfully.",
    data: result,
  });
});

const putCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

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
  getCategoryForSidebar
};
