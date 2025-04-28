import { categoriesModel } from "./categories.model";
import { CATEGORIES_SEARCHABLE_FIELDS } from "./categories.constant";
import QueryBuilder from "../../builder/QueryBuilder";
import status from "http-status";
import AppError from "../../errors/AppError";

export const categoriesService = {
  async postCategoriesIntoDB(data: any) {
    try {

      // Step 1: Check if the categories already exists in the database
      const isExist = await categoriesModel.findOne({
        name: data.name,
        parentCategory: data.parentCategory,
      });
      if (isExist) {
        throw new AppError(status.CONFLICT, "category already exists");
      }
      let result: any = await categoriesModel.create(data);
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
  async getAllCategoriesFromDB(query: any) {
    try {
      const service_query = new QueryBuilder(categoriesModel.find(), query)
        .search(CATEGORIES_SEARCHABLE_FIELDS)
        .filter()
        .sort()
        .paginate()
        .fields();

      let result = await service_query.modelQuery.populate({
        path: "parentCategory",
        match: { isDelete: false },
      });

      result = result.map((item: any) => {
        const data = item.toObject();
        return {
          ...data,
          parentCategory: item.parentCategory
            ? {
                ...item.parentCategory.toObject(),
                image: item.parentCategory.image
                  ? `${
                      process.env.BASE_URL
                    }/${item.parentCategory.image.replace(/\\/g, "/")}`
                  : null,
              }
            : null,
          image: data.image
            ? `${process.env.BASE_URL}/${data.image.replace(/\\/g, "/")}`
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
  async getSingleCategoriesFromDB(id: string) {
    try {
      let result: any = await categoriesModel.findById(id);

      if (!result) {
        throw new AppError(status.NOT_FOUND, "categories not found");
      }
      if (result.isDelete) {
        throw new AppError(status.NOT_FOUND, "category already deleted");
      }
      result = {
        ...result.toObject(),
        image: result.image
          ? `${process.env.BASE_URL}/${result.image?.replace(/\\/g, "/")}`
          : null,
        parentCategory: result.parentCategory
          ? {
              ...result.parentCategory.toObject(),
              image: result.parentCategory.image
                ? `${
                    process.env.BASE_URL
                  }/${result.parentCategory.image.replace(/\\/g, "/")}`
                : null,
            }
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
  async updateCategoriesIntoDB(data: any, id: string) {
    try {
      const result = await categoriesModel.updateOne({ _id: id }, data, {
        new: true,
      });
      if (!result) {
        throw new Error("categories not found.");
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

  async deleteCategoriesFromDB(id: string) {
    try {
      // Step 1: Check if the categories exists in the database
      const isExist = await categoriesModel.findOne({ _id: id });

      if (!isExist) {
        throw new AppError(status.NOT_FOUND, "categories not found");
      }
      // Step 2: Check if the categories is already deleted
      if (isExist.isDelete) {
        throw new AppError(status.NOT_FOUND, "categories already deleted");
      }
      // Step 3: Check if the categories is already inactive
      if (!isExist.isActive) {
        throw new AppError(status.NOT_FOUND, "categories already inactive");
      }
      // // Step 4: Check if the categories has any child categories
      // const hasChildCategories = await categoriesModel.findOne({
      //   parentCategory: id,
      // });
      // if (hasChildCategories) {
      //   throw new AppError(
      //     status.NOT_FOUND,
      //     "categories has child categories. Please delete them first."
      //   );
      // }

      // Step 4: Delete the home categories from the database
      await categoriesModel.updateOne({ _id: id }, { isDelete: true });
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
