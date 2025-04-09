// attributeOption.controller.ts - attributeOption module
import status from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { AttributeOptionServices } from "./attributeOption.service";

const postAttributeOption = catchAsync(async (req, res) => {
  const data = req.body;

  const result = await AttributeOptionServices.postAttributeOptionIntoDB(data);

  // Send a success response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Attribute Option is created succesfully.",
    data: result,
  });
});

const getAttributeOption = catchAsync(async (req, res) => {
  const result = await AttributeOptionServices.getCategoriesIntoDB(req.query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Attribute Option is get succesfully.",
    data: result,
  });
});

const putAttributeOption = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AttributeOptionServices.putAttributeOptionIntoDB({
    id,
    ...req.body,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Attribute Option is edited successfully.",
    data: result,
  });
});

const deleteAttributeOption = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = AttributeOptionServices.deleteAttributeOptionIntoDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Attribute Option deleted successfully",
    data: result,
  });
});

export const AttributeOptionController = {
  postAttributeOption,
  getAttributeOption,
  putAttributeOption,
  deleteAttributeOption,
};
