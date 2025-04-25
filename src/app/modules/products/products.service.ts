import { productsModel } from "./products.model";
import { PRODUCTS_SEARCHABLE_FIELDS } from "./products.constant";
import QueryBuilder from "../../builder/QueryBuilder";
import status from "http-status";
import AppError from "../../errors/AppError";
import path from "path";

export const productsService = {
  async postProductsIntoDB(data: any) {
    try {
      // Check for existing product by SKU (or use name, slug, etc. if preferred)
      const existingProduct = await productsModel.findOne({
        $or: [{ sku: data.sku }, { name: data.name }, { slug: data.slug }],
      });

      if (existingProduct) {
        throw new Error("A product already exists.");
      }

      // Create new product
      return await productsModel.create(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error(
          "An unknown error occurred while inserting the product."
        );
      }
    }
  },

  async getAllProductsFromDB(query: any) {
    try {
      const service_query = new QueryBuilder(productsModel.find(), query)
        .search(PRODUCTS_SEARCHABLE_FIELDS)
        .filter()
        .sort()
        .paginate()
        .fields();

      let result: any = await service_query.modelQuery
        .populate({
          path: "brand",
          match: { isDelete: false },
        })
        .populate({
          path: "category",
          match: { isDelete: false },
        })
        .populate({
          path: "subcategories",
          match: { isDelete: false },
        })

        .populate({
          path: "variant",

          match: { isDelete: false },
          populate: {
            path: "attributeOption",
            match: { isDelete: false },
          },
        });

      result = result.map((item: any) => {
        const productData = item.toObject();
        return {
          ...productData,
          images: productData.images.map((image: string) => {
            return image
              ? `${process.env.BASE_URL}/${image.replace(/\\/g, "/")}`
              : null;
          }),
          thumbnail: productData.thumbnail
            ? `${process.env.BASE_URL}/${productData.thumbnail.replace(
                /\\/g,
                "/"
              )}`
            : null,
          video: productData.video
            ? `${process.env.BASE_URL}/${productData.video.replace(/\\/g, "/")}`
            : null,
          brand: {
            ...productData.brand,
            brandImage: productData?.brand?.brandImage
              ? `${process.env.BASE_URL}/${productData.brand.brandImage.replace(
                  /\\/g,
                  "/"
                )}`
              : null,
          },
          category: {
            ...productData.category,
            image: productData.category.image
              ? `${process.env.BASE_URL}/${productData.category.image.replace(
                  /\\/g,
                  "/"
                )}`
              : null,
          },
          subcategories: productData.subcategories.map((subcategory: any) => ({
            ...subcategory,
            image: subcategory.image
              ? `${process.env.BASE_URL}/${subcategory.image.replace(
                  /\\/g,
                  "/"
                )}`
              : null,
          })),

          variant: productData.variant.map((variant: any) => ({
            ...variant,
            attributeOption: variant.attributeOption.map((option: any) => ({
              ...option,
              image: option.image
                ? `${process.env.BASE_URL}/${option.image.replace(/\\/g, "/")}`
                : null,
            })),
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
  async getSingleProductsFromDB(id: string) {
    try {
      return await productsModel.findById(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async updateProductsIntoDB(data: any, id: string) {
    
    try {

      if(!data){
        throw new AppError(status.BAD_REQUEST, "data is required");
      }
      const isDeleted = await productsModel.findOne({ _id: id });
      if (isDeleted?.isDelete) {
        throw new AppError(status.NOT_FOUND, "products is already deleted");
      }

      const result = await productsModel.updateOne(
        { _id: id },
        {
          $set: {
            ...data,
          },
        },
        { new: true }
      );
      if (!result) {
        throw new Error("products not found.");
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
  async deleteProductsFromDB(id: string) {
    try {
      // Step 1: Check if the products exists in the database
      const isExist = await productsModel.findOne({ _id: id });

      if (!isExist) {
        throw new AppError(status.NOT_FOUND, "products not found");
      }

      // Step 4: Delete the home products from the database
      await productsModel.updateOne({ _id: id }, { isDelete: true });
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
