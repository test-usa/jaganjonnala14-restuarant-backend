// attribute.controller.ts - attribute module
import status from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { AttributeServices } from "./attribute.service";

const postAttribute = catchAsync(async (req, res) => {
  const data = req.body;

  const result = await AttributeServices.postAttributeIntoDB(data);

  // Send a success response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Attribute is created succesfully.",
    data: result,
  });
});

const getAttribute = catchAsync(async (req, res) => {
  const result = await AttributeServices.getAttributeIntoDB(req.query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Attribute is get succesfully.",
    data: result,
  });
});

const putAttribute = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AttributeServices.putAttributeIntoDB({
    id,
    ...req.body,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Attribute is edited successfully.",
    data: result,
  });
});

const deleteAttribute = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = AttributeServices.deleteAttributeIntoDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Attribute deleted successfully",
    data: result,
  });
});

export const AttributeController = {
  postAttribute,
  getAttribute,
  putAttribute,
  deleteAttribute,
};
