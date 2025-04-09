/* eslint-disable @typescript-eslint/no-explicit-any */
// categories.service.ts - categories module

import status from "http-status";
import AppError from "../../errors/AppError";
import { checkIfDocumentExists } from "../../utils/CheckIfDocumentExist";
import { ICategory } from "./categories.interface";
import categoryModel from "./categories.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { category_searchable_fields } from "./categories.constant";

const postCategoryIntoDB = async (data: ICategory) => {
  try {
    // Check if category already exists
    const existingCategory = await checkIfDocumentExists(
      categoryModel,
      "name",
      data.name
    );
    if (existingCategory) {
      throw new AppError(status.NOT_FOUND, "Category already exists");
    }

    // Create a new category in the database
    const category = await categoryModel.create(data);

    return category;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const getCategoriesIntoDB = async (query: Record<string, unknown>) => {
  try {
    const service_query = new QueryBuilder(categoryModel.find(), query)
      .search(category_searchable_fields)
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await service_query.modelQuery
      .populate({
        path: "subcategories",
        model: "Category",
        populate: {
          path: "subcategories",
          model: "Category",
        },
      })
      .populate({
        path: "categories",
        model: "Category",
        populate: {
          path: "subcategories",
          model: "Category",
        },
      })
      .populate({
        path: "parentCategory",
        model: "Category",
      })
      .populate({
        path: "category",
        model: "Category",
      });

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
const getCategoriesForSidebarIntoDB = async (
  query: Record<string, unknown>
) => {
  try {
    const service_query = new QueryBuilder(
      categoryModel.find({ status: "active" }),
      query
    )
      .search([])
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await service_query.modelQuery
      .populate({
        path: "subcategories",
        model: "Category",
        select: "name _id type",

        populate: {
          path: "subcategories",
          model: "Category",
          select: "name _id type",
        },
      })
      .populate({
        path: "categories",
        model: "Category",
        select: "name _id type",

        populate: {
          path: "subcategories",
          model: "Category",
          select: "name _id type",
        },
      })
      .populate({
        path: "parentCategory",
        model: "Category",
        select: "name _id type",
      })
      .populate({
        path: "category",
        model: "Category",
        select: "name _id type",
      });

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

const putCategoryIntoDB = async (data: any) => {
  try {
    const isDeleted = await categoryModel.findOne({ _id: data.id });
    if (isDeleted?.isDelete) {
      throw new AppError(status.NOT_FOUND, "Category is already deleted");
    }

    const result = await categoryModel.updateOne({ _id: data.id }, data, {
      new: true,
    });
    if (!result) {
      throw new Error("Category not found.");
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

const deleteCategoryIntoDB = async (id: string) => {
  try {
    // Step 1: Check if the banner exists in the database
    const isExist = await categoryModel.findOne({ _id: id });

    if (!isExist) {
      throw new AppError(status.NOT_FOUND, "Category not found");
    }

    // Step 4: Delete the home banner from the database
    await categoryModel.updateOne({ _id: id }, { isDelete: true });
    return;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
};
const deleteBulkCategoryIntoDB = async (ids: string[]) => {
  try {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new Error("Invalid IDs provided");
    }

    // Step 1: Check if the units exist in the database
    const existingData = await categoryModel.find({ _id: { $in: ids } });

    if (existingData.length === 0) {
      throw new AppError(
        status.NOT_FOUND,
        "No categories found with the given IDs"
      );
    }

    // Step 2: Perform soft delete by updating `isDelete` field to `true`
    await categoryModel.updateMany({ _id: { $in: ids } }, { isDelete: true });

    return;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
};

export const categoryServices = {
  postCategoryIntoDB,
  getCategoriesIntoDB,
  putCategoryIntoDB,
  deleteCategoryIntoDB,
  deleteBulkCategoryIntoDB,
  getCategoriesForSidebarIntoDB,
};
