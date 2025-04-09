/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { productService } from "./product.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import { productModel } from "./product.model";
import path from "path";
import fs from "fs";

const create = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.create(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Created successfully",
    data: result,
  });
});

const filterProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.filterProducts(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});
const searchProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.searchProducts(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});
const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.getAll(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});
const getAllByCategory = catchAsync(async (req: Request, res: Response) => {
 
  const result = await productService.getAllByCategory(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.getById(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await productModel.findOne({ _id: id });

  if (!product) {
    return sendResponse(res, {
      statusCode: status.NOT_FOUND,
      success: false,
      message: "Product not found",
      data: null,
    });
  }

  const isNewFeatureImageUploaded = !!req.body.productFeatureImage;
  const isNewImagesUploaded =
    req.body.productImages && req.body.productImages.length > 0;
  // আগের ইমেজ রেখে দিতে হবে যদি নতুন ইমেজ আপলোড না করা হয়
  if (!isNewFeatureImageUploaded) {
    req.body.productFeatureImage = product.productFeatureImage;
  }

  if (!isNewImagesUploaded) {
    req.body.productImages = product.productImages;
  }

  // নতুন ছবি থাকলে আগেরটা ডিলিট করবো
  if (isNewFeatureImageUploaded && product.productFeatureImage) {
    const oldFeatureImagePath = path.join(
      __dirname,
      "../../../../uploads",
      path.basename(product.productFeatureImage as string)
    );

    if (fs.existsSync(oldFeatureImagePath)) {
      try {
        fs.unlinkSync(oldFeatureImagePath);
      } catch (error : any) {
        throw new Error(`Error deleting old feature image: ${error.message}`);
      }
    }
  }

  // নতুন productImages থাকলে পুরনোগুলো মুছবো
  if (isNewImagesUploaded && product.productImages.length > 0) {
    (product.productImages as string[]).forEach((oldImage: string) => {
      const oldImagePath = path.join(
        __dirname,
        "../../../../uploads",
        path.basename(oldImage)
      );

      if (fs.existsSync(oldImagePath)) {
        try {
          fs.unlinkSync(oldImagePath);
        } catch (error) {
          console.error("Error deleting old product image:", error);
        }
      }
    });
  }

  const result = await productService.update({ ...req.body, id });
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Updated successfully",
    data: result,
  });
});

const deleteEntity = catchAsync(async (req: Request, res: Response) => {
  await productService.delete(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Deleted successfully",
    data: null,
  });
});

const bulkDelete = catchAsync(async (req: Request, res: Response) => {
  const ids: string[] = req.body.ids; // Expecting an array of IDs to be passed for bulk delete
  if (!Array.isArray(ids) || ids.length === 0) {
    return sendResponse(res, {
      statusCode: status.BAD_REQUEST,
      success: false,
      message: "Invalid IDs array",
      data: null,
    });
  }
  await productService.bulkDelete(ids);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Bulk delete successful",
    data: null,
  });
});

export const productController = {
  create,
  getAll,
  getAllByCategory,
  getById,
  update,
  delete: deleteEntity,
  bulkDelete,
  filterProducts,
  searchProducts
};
