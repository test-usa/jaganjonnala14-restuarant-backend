// attribute.service.ts - attribute module
// attribute.service.ts - attribute module
/* eslint-disable @typescript-eslint/no-explicit-any */
// categories.service.ts - categories module

import status from "http-status";
import AppError from "../../errors/AppError";
import { checkIfDocumentExists } from "../../utils/CheckIfDocumentExist";
import QueryBuilder from "../../builder/QueryBuilder";
import { IAttribute } from "./attribute.interface";
import { Attribute_searchable_fields } from "./attribute.constant";
import { AttributeModel } from "./attribute.model";

const postAttributeIntoDB = async (data: IAttribute) => {
  try {
    // Check if Attribute already exists
    const existingAttribute = await checkIfDocumentExists(
      AttributeModel,
      "name",
      data.name
    );
    if (existingAttribute) {
      throw new AppError(status.NOT_FOUND, "Attribute already exists");
    }
    // Create a new Attribute in the database
    const Attribute = await AttributeModel.create(data);

    return Attribute;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const getAttributeIntoDB = async (query: Record<string, unknown>) => {
  try {
    const service_query = new QueryBuilder(AttributeModel.find(), query)
      .search(Attribute_searchable_fields)
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await service_query.modelQuery.populate("attributeOption");

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

const putAttributeIntoDB = async (data: any) => {
  try {
    const isDeleted = await AttributeModel.findOne({ _id: data.id });
    if (isDeleted?.isDelete) {
      throw new AppError(
        status.NOT_FOUND,
        "Attribute  is already deleted"
      );
    }

    const result = await AttributeModel.updateOne(
      { _id: data.id },
      data,
      {
        new: true,
      }
    );
    if (!result) {
      throw new Error("Attribute not found.");
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

const deleteAttributeIntoDB = async (id: string) => {
  try {
    // Step 1: Check if the banner exists in the database
    const isExist = await AttributeModel.findOne({ _id: id });

    if (!isExist) {
      throw new AppError(status.NOT_FOUND, "Attribute  not found");
    }

    // Step 4: Delete the home banner from the database
    await AttributeModel.updateOne({ _id: id }, { isDelete: true });
    return;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
};

export const AttributeServices = {
  postAttributeIntoDB,
  getAttributeIntoDB,
  putAttributeIntoDB,
  deleteAttributeIntoDB,
};
