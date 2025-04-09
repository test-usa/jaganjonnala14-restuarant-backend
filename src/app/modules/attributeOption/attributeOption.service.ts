// attributeOption.service.ts - attributeOption module
/* eslint-disable @typescript-eslint/no-explicit-any */
// categories.service.ts - categories module

import status from "http-status";
import AppError from "../../errors/AppError";
import { checkIfDocumentExists } from "../../utils/CheckIfDocumentExist";
import QueryBuilder from "../../builder/QueryBuilder";
import { AttributeOption_searchable_fields } from "./attributeOption.constant";
import { IAttributeOption } from "./attributeOption.interface";
import AttributeOptionModel from "./attributeOption.model";

const postAttributeOptionIntoDB = async (data: IAttributeOption) => {
  try {
    // Check if AttributeOption already exists
    const existingAttributeOption = await checkIfDocumentExists(
      AttributeOptionModel,
      "name",
      data.name
    );
    if (existingAttributeOption) {
      throw new AppError(status.NOT_FOUND, "Attribute Option already exists");
    }
    // Create a new AttributeOption in the database
    const AttributeOption = await AttributeOptionModel.create(data);

    return AttributeOption;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const getCategoriesIntoDB = async (query: Record<string, unknown>) => {
  try {
    const service_query = new QueryBuilder(AttributeOptionModel.find(), query)
      .search(AttributeOption_searchable_fields)
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await service_query.modelQuery;

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

const putAttributeOptionIntoDB = async (data: any) => {
  try {
    const isDeleted = await AttributeOptionModel.findOne({ _id: data.id });
    if (isDeleted?.isDelete) {
      throw new AppError(
        status.NOT_FOUND,
        "Attribute Option is already deleted"
      );
    }

    const result = await AttributeOptionModel.updateOne(
      { _id: data.id },
      data,
      {
        new: true,
      }
    );
    if (!result) {
      throw new Error("AttributeOption not found.");
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

const deleteAttributeOptionIntoDB = async (id: string) => {
  try {
    // Step 1: Check if the banner exists in the database
    const isExist = await AttributeOptionModel.findOne({ _id: id });

    if (!isExist) {
      throw new AppError(status.NOT_FOUND, "Attribute Option not found");
    }

    // Step 4: Delete the home banner from the database
    await AttributeOptionModel.updateOne({ _id: id }, { isDelete: true });
    return;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
};

export const AttributeOptionServices = {
  postAttributeOptionIntoDB,
  getCategoriesIntoDB,
  putAttributeOptionIntoDB,
  deleteAttributeOptionIntoDB,
};
