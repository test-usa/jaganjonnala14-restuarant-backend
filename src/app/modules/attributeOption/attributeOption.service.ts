import { attributeOptionModel } from "./attributeOption.model";
import { ATTRIBUTEOPTION_SEARCHABLE_FIELDS } from "./attributeOption.constant";
import QueryBuilder from "../../builder/QueryBuilder";
import status from "http-status";
import AppError from "../../errors/AppError";

export const attributeOptionService = {
  async postAttributeOptionIntoDB(data: any) {
    try {
      // Step 1: Check if the attributeOption already exists in the database
      const isExist = await attributeOptionModel.findOne({
        name: data.name,
        isDelete: false,
      });
      if (isExist) {
        throw new AppError(status.CONFLICT, "attributeOption already exists");
      }
      const result = await attributeOptionModel.create(data);
      return {
        ...result.toObject(),
        image: result.image
          ? `${process.env.BASE_URL}/${result.image?.replace(/\\/g, "/")}`
          : null,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async getAllAttributeOptionFromDB(query: any) {
    try {
      const service_query = new QueryBuilder(attributeOptionModel.find(), query)
        .search(ATTRIBUTEOPTION_SEARCHABLE_FIELDS)
        .filter()
        .sort()
        .paginate()
        .fields();

      let result = await service_query.modelQuery;

      result = result.map((item: any) => {
        const data = item.toObject();
        return {
          ...data,
          image: data.image
            ? `${process.env.BASE_URL}/${data.image?.replace(/\\/g, "/")}`
            : null,
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
  async getSingleAttributeOptionFromDB(id: string) {
    try {
      let result: any = await attributeOptionModel.findById(id);
      if (!result) {
        throw new AppError(status.NOT_FOUND, "attributeOption not found");
      }
      if (result?.isDelete) {
        throw new AppError(status.NOT_FOUND, "attributeOption is already deleted");
      }
      if (!result?.isActive) {
        throw new AppError(status.NOT_FOUND, "attributeOption is not active");
      }
      result = {
        ...result.toObject(),
        image: result.image
          ? `${process.env.BASE_URL}/${result.image?.replace(/\\/g, "/")}`
          : null,
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
  async updateAttributeOptionIntoDB(data: any, id: string) {
    try {
      const isDeleted = await attributeOptionModel.findOne({ _id: id });
      if (isDeleted?.isDelete) {
        throw new AppError(
          status.NOT_FOUND,
          "attributeOption is already deleted"
        );
      }

      const result = await attributeOptionModel.updateOne(
        { _id: data.id },
        data,
        {
          new: true,
        }
      );
  
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async deleteAttributeOptionFromDB(id: string) {
    try {
      // Step 1: Check if the attributeOption exists in the database
      const isExist = await attributeOptionModel.findOne({ _id: id , isDelete: false });

      if (!isExist) {
        throw new AppError(status.NOT_FOUND, "attributeOption not found");
      }
      // Step 2: Check if the attributeOption is already inactive
      if (!isExist.isActive) {
        throw new AppError(status.NOT_FOUND, "attributeOption already Inactive");
      }

      // Step 4: Delete the home attributeOption from the database
      await attributeOptionModel.updateOne({ _id: id }, { isDelete: true });
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
