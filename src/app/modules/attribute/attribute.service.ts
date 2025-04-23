import { attributeModel } from "./attribute.model";
import { ATTRIBUTE_SEARCHABLE_FIELDS } from "./attribute.constant";
import QueryBuilder from "../../builder/QueryBuilder";
import status from "http-status";
import AppError from "../../errors/AppError";

export const attributeService = {
  async postAttributeIntoDB(data: any) {
    try {
      const isExist = await attributeModel.findOne({ name: data.name });
      if (isExist) {
        throw new AppError(status.CONFLICT, "attribute already exists");
      }
      return await attributeModel.create(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async getAllAttributeFromDB(query: any) {
    try {
      const service_query = new QueryBuilder(attributeModel.find(), query)
        .search(ATTRIBUTE_SEARCHABLE_FIELDS)
        .filter()
        .sort()
        .paginate()
        .fields();

      let result = await service_query.modelQuery.populate({
        path: "attributeOption",
        match: { isDelete: false },
      });

      result = result.map((item: any) => {
        const attributeData = item.toObject();
        return {
          ...attributeData,
          attributeOption: attributeData.attributeOption.map((option: any) => ({
            ...option,
            image: option.image
              ? `${process.env.BASE_URL}/${option.image?.replace(/\\/g, "/")}`
              : null,
          })),
        };
      });
      const meta = await service_query.countTotal();
      return {
        result,
        meta,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async getSingleAttributeFromDB(id: string) {
    try {
      let result: any = await attributeModel
        .findById(id)
        .populate({
          path: "attributeOption",
          match: { isDelete: false },
        });
      if (!result) {
        throw new AppError(status.NOT_FOUND, "attribute not found");
      }
      if (result?.isDelete) {
        throw new AppError(status.NOT_FOUND, "attribute is already deleted");
      }
      if (!result?.isActive) {
        throw new AppError(status.NOT_FOUND, "attribute is not active");
      }

      result = {
        ...result.toObject(),
        attributeOption: result.attributeOption.map((option: any) => ({
          ...option?.toObject(),
          image: option.image
            ? `${process.env.BASE_URL}/${option.image?.replace(/\\/g, "/")}`
            : null,
        })),
      };

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async updateAttributeIntoDB(data: any, id: string) {
    try {
      const attribute = await attributeModel.findOne({ _id: id });

      if (!attribute) {
        throw new AppError(status.NOT_FOUND, "attribute not found");
      }
      if (attribute?.isDelete) {
        throw new AppError(status.NOT_FOUND, "attribute is already deleted");
      }
      if (!attribute?.isActive) {
        throw new AppError(status.NOT_FOUND, "attribute is not active");
      }

      const result = await attributeModel.updateOne({ _id: id }, data, {
        new: true,
      });

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async deleteAttributeFromDB(id: string) {
    try {
      // Step 1: Check if the attribute exists in the database
      const isExist = await attributeModel.findOne({ _id: id });
      if (!isExist) {
        throw new AppError(status.NOT_FOUND, "attribute not found");
      }
      // Step 2: Check if the attribute is already deleted
      if (isExist.isDelete) {
        throw new AppError(status.NOT_FOUND, "attribute already deleted");
      }
      // Step 3: Check if the attribute is active
      if (!isExist.isActive) {
        throw new AppError(status.NOT_FOUND, "attribute already inactive");
      }

      // Step 4: Delete the home attribute from the database
      await attributeModel.updateOne({ _id: id }, { isDelete: true });
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
};
