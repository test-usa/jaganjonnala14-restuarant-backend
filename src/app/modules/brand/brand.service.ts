// brand.service.ts - brand module
/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";

import AppError from "../../errors/AppError";
import { formatResultImage } from "../../utils/formatImage";
import { IBrand } from "./brand.interface";
import { BrandModel } from "./brand.model";
import { brand_searchable_fields } from "./brand.constant";

// brand.service.ts - brand module
const createbrandIntoDB = async (data: Partial<IBrand>) => {
  try {
    const result = await BrandModel.create(data);
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const getbrandByIdFromDB = async (id: any) => {
  try {
    const result = await BrandModel.findById(id);
    if (!result) {
      throw new AppError(status.NOT_FOUND, "brand not found.");
    }

    if (result.isDelete) {
      throw new AppError(status.FORBIDDEN, "This brand is deleted.");
    }
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const getAllbrandsFromDB = async (query: any) => {
  try {
    const service_query = new QueryBuilder(BrandModel.find(), query)
      .search(brand_searchable_fields)
      .filter()
      .sort()
      .paginate()
      .fields();

    let result: any = await service_query.modelQuery;
    result = formatResultImage(result, "image");
    const meta = await service_query.countTotal();
    return {
      result,
      meta,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
};

const updatebrandInDB = async (data: any) => {
  try {
    const isDeleted = await BrandModel.findOne({ _id: data.id });
    if (isDeleted?.isDelete) {
      throw new AppError(status.NOT_FOUND, "brand is already deleted");
    }

    const result = await BrandModel.updateOne({ _id: data.id }, data, {
      new: true,
    });
    if (!result) {
      throw new Error("brand not found.");
    }
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Database Update Error: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
};

const deletebrandFromDB = async (id: any) => {
  try {
    // Step 1: Check if the banner exists in the database
    const isExist = await BrandModel.findOne({ _id: id });

    if (!isExist) {
      throw new AppError(status.NOT_FOUND, "brand not found");
    }

    // Step 4: Delete the home banner from the database
    await BrandModel.updateOne({ _id: id }, { isDelete: true });
    return;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
};
const bulkSoftDeleteFromDB = async (ids: string[]) => {
  try {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new Error("Invalid IDs provided");
    }

    // Step 1: Check if the brands exist in the database
    const existingBrands = await BrandModel.find({ _id: { $in: ids } });

    if (existingBrands.length === 0) {
      throw new AppError(status.NOT_FOUND, "No brands found with the given IDs");
    }

    // Step 2: Perform soft delete by updating `isDelete` field to `true`
    await BrandModel.updateMany({ _id: { $in: ids } }, { isDelete: true });

    return ;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
};

export const brandServcies = {
  createbrandIntoDB,
  getbrandByIdFromDB,
  getAllbrandsFromDB,
  updatebrandInDB,
  deletebrandFromDB,
  bulkSoftDeleteFromDB
};
