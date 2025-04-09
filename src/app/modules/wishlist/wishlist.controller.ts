import { Request, Response } from "express";
import { wishlistService } from "./wishlist.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const create = catchAsync(async (req: Request, res: Response) => {

  const result = await wishlistService.create(req?.user, req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Product added to wishlist successfully",
    data: result,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await wishlistService.getAll(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});
const adminDeleteWishlist = catchAsync(async (req: Request, res: Response) => {
  const result = await wishlistService.adminDeleteWishlist(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});


const getById = catchAsync(async (req: Request, res: Response) => {
  const result = await wishlistService.getById(req?.user?.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const result = await wishlistService.update(req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Updated successfully",
    data: result,
  });
});

const deleteEntity = catchAsync(async (req: Request, res: Response) => {
 const {productId} = req.body;
  await wishlistService.delete(req?.user?.id, productId);
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
  await wishlistService.bulkDelete(ids);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Bulk delete successful",
    data: null,
  });
});

export const wishlistController = {
  create,
  getAll,
  getById,
  update,
  delete: deleteEntity,
  bulkDelete,
  adminDeleteWishlist
};
