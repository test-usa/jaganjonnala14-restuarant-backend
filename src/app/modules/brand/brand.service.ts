import { brandModel } from "./brand.model";
import { BRAND_SEARCHABLE_FIELDS } from "./brand.constant";
import QueryBuilder from "../../builder/QueryBuilder";
import status from "http-status";
import AppError from "../../errors/AppError";

export const brandService = {
  async postBrandIntoDB(data: any) {
    try {
      // Step 1: Check if the brand already exists in the database
      const isExist = await brandModel.findOne({
        brandName: data.brandName,
      });
      if (isExist) {
        throw new AppError(status.CONFLICT, "Brand already exists");
      }
      // Step 2: Create a new brand in the database
      let result: any = await brandModel.create(data);
      result = {
        ...result.toObject(),
        brandImage: result.brandImage
          ? `${process.env.BASE_URL}/${result.brandImage?.replace(/\\/g, "/")}`
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
  async getAllBrandFromDB(query: any) {
    try {
      const service_query = new QueryBuilder(brandModel.find(), query)
        .search(BRAND_SEARCHABLE_FIELDS)
        .filter()
        .sort()
        .paginate()
        .fields();

      let result = await service_query.modelQuery;

      result = result.map((item: any) => {
        const brandData = item.toObject();
        return {
          ...brandData,
          brandImage: brandData.brandImage
            ? `${process.env.BASE_URL}/${brandData.brandImage?.replace(
                /\\/g,
                "/"
              )}`
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
  async getSingleBrandFromDB(id: string) {
    try {

      let result: any = await brandModel.findById(id);
      if (!result) {
        throw new AppError(status.NOT_FOUND, "Brand not found");
      }
      if (result.isDelete) {
        throw new AppError(status.NOT_FOUND, "Brand already deleted");
      }

      result = {
        ...result.toObject(),
        brandImage: result.brandImage
          ? `${process.env.BASE_URL}/${result.brandImage?.replace(/\\/g, "/")}`
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
  async updateBrandIntoDB(data: any, id: string) {
    try {
      const result = await brandModel.updateOne({ _id: id }, data, {
        new: true,
      });
      if (!result) {
        throw new Error("brand not found.");
      }
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async deleteBrandFromDB(id: string) {
    try {
      // Step 1: Check if the brand exists in the database
      const isExist = await brandModel.findOne({ _id: id });

      if (!isExist) {
        throw new AppError(status.NOT_FOUND, "brand not found");
      }

      // Step 4: Delete the home brand from the database
      const result = await brandModel.updateOne(
        { _id: id },
        { isDelete: true }
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
};
