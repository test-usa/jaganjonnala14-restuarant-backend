/* eslint-disable @typescript-eslint/no-explicit-any */
import { wishlistModel } from "./wishlist.model";
import { WISHLIST_SEARCHABLE_FIELDS } from "./wishlist.constant";
import QueryBuilder from "../../builder/QueryBuilder";
import status from "http-status";
import AppError from "../../errors/AppError";
import { productModel } from "../product/product.model";
import config from "../../config";
import { usersModel } from "../users/users.model";

export const wishlistService = {
  async create(user: any, data: any) {
    try {
      const customerExists = await usersModel.findById(user?.id);
      if (!customerExists) {
        throw new AppError(status.NOT_FOUND, "Customer not found");
      }

      // Check if the product exists
      const foundProduct = await productModel.findById(data?.product);
      if (!foundProduct) {
        throw new AppError(status.NOT_FOUND, "Product not found");
      }

      // Find the user's wishlist
      let wishlist = await wishlistModel.findOne({ user: user?.id });

      if (wishlist) {
        // If wishlist exists, add the product to the wishlist
        // Check if product already exists in wishlist
        if (!wishlist.products.includes(data?.product)) {
          wishlist.products.push(data?.product);
          await wishlist.save();
          return wishlist;
        } else {
          throw new Error("Product already in wishlist");
          // throw new AppError(status.BAD_REQUEST, "Product already in wishlist");
        }
      } else {
        // If no wishlist exists, create a new one
        wishlist = new wishlistModel({
          user: user?.id,
          products: [data?.product],
        });
        await wishlist.save();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async getAll(query: any) {
    try {
      const service_query = new QueryBuilder(wishlistModel.find(), query)
        .search(WISHLIST_SEARCHABLE_FIELDS)
        .filter()
        .sort()
        .paginate()
        .fields();

      const data: any = await service_query.modelQuery
        .populate("user")
        .populate({
          path: "products",
          populate: [
            { path: "productBrand" }, // Populate productBrand
            { path: "productCategory" }, // Populate productCategory
            { path: "productVariants" }, // Populate productVariants
          ],
        });
      const result = data.map((data: any) => {
        return {
          ...data.toObject(),
          products: data?.products?.map((product: any) => {
            const productData = product?.toObject();

            return {
              ...productData,
              productBrand: {
                ...productData.productBrand,
                image: `${config.base_url}/${productData.productBrand.image?.replace(/\\/g, "/")}`,
              },
              productFeatureImage: product.productFeatureImage
                ? `${config.base_url}/${product.productFeatureImage.replace(/\\/g, "/")}`
                : null,
              productImages: productData.productImages.map(
                (img: string) =>
                  `${config.base_url}/${img?.replace(/\\/g, "/")}`
              ),
            };
          }),
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

  async getById(id: string) {
    try {
      const data: any = await wishlistModel
        .findOne({
          user: id,
          isDelete: false,
        })
        .populate({
          path: "products",
          populate: [
            { path: "productBrand" }, // Populate productBrand
            { path: "productCategory" }, // Populate productCategory
            { path: "productVariants" }, // Populate productVariants
          ],
        });
      // 🔹 Modify result for images (convert file paths to URLs)

      const result = {
        ...data?.toObject(),
        products: data?.products?.map((product: any) => {
          const productData = product?.toObject();

          return {
            ...productData,
            productBrand: {
              ...productData.productBrand,
              image: `${config.base_url}/${productData.productBrand.image?.replace(/\\/g, "/")}`,
            },
            productFeatureImage: product.productFeatureImage
              ? `${config.base_url}/${product.productFeatureImage.replace(/\\/g, "/")}`
              : null,
            productImages: productData.productImages.map(
              (img: string) => `${config.base_url}/${img?.replace(/\\/g, "/")}`
            ),
          };
        }),
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
  async update(data: any) {
    try {
      const isDeleted = await wishlistModel.findOne({ _id: data.id });
      if (isDeleted?.isDelete) {
        throw new AppError(status.NOT_FOUND, "wishlist is already deleted");
      }

      const result = await wishlistModel.updateOne({ _id: data.id }, data, {
        new: true,
      });
      if (!result) {
        throw new Error("wishlist not found.");
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
  async delete(userId: string, productId: string) {
    try {
      // Check if the user's wishlist exists
      const wishlist = await wishlistModel.findOne({ user: userId });

      if (!wishlist) {
        throw new AppError(status.NOT_FOUND, "Wishlist not found");
      }

      // Check if the product exists in the wishlist
      const productIndex = wishlist.products.findIndex((product: any) =>
        product.equals(productId)
      );
      if (productIndex === -1) {
        throw new AppError(status.BAD_REQUEST, "Product not found in wishlist");
      }

      // Remove the product from the wishlist
      wishlist.products.splice(productIndex, 1);

      // If wishlist is empty after removal, delete the wishlist
      if (wishlist.products.length === 0) {
        await wishlistModel.deleteOne({ user: userId });
        return { message: "Wishlist deleted since it became empty" };
      }

      // Save the updated wishlist
      await wishlist.save();
      return { message: "Product removed from wishlist" };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error(
          "An unknown error occurred while deleting wishlist item."
        );
      }
    }
  },
  async adminDeleteWishlist(id: string) {
    try {
      // Check if the wishlist exists
      const wishlist = await wishlistModel.findById(id);
      
      if (!wishlist) {
        throw new AppError(status.NOT_FOUND, "Wishlist not found");
      }

      // Check if already deleted
      if (wishlist.isDelete) {
        throw new AppError(status.BAD_REQUEST, "Wishlist already deleted");
      }

      // Soft delete the wishlist
      const deletedWishlist = await wishlistModel.findByIdAndUpdate(
        id,
        { 
          $set: { 
            isDelete: true,
            deletedAt: new Date() 
          } 
        },
        { new: true }
      );

      if (!deletedWishlist) {
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to delete wishlist");
      }

      return deletedWishlist;
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; // Re-throw custom AppError as is
      } else if (error instanceof Error) {
        throw new AppError(
          status.INTERNAL_SERVER_ERROR, 
          `Failed to delete wishlist: ${error.message}`
        );
      } else {
        throw new AppError(
          status.INTERNAL_SERVER_ERROR,
          "An unknown error occurred while deleting wishlist"
        );
      }
    }
  },
  async bulkDelete(ids: string[]) {
    try {
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new Error("Invalid IDs provided");
      }

      // Step 1: Check if the wishlist exist in the database
      const existingwishlist = await wishlistModel.find({ _id: { $in: ids } });

      if (existingwishlist.length === 0) {
        throw new AppError(
          status.NOT_FOUND,
          "No wishlist found with the given IDs"
        );
      }

      // Step 2: Perform soft delete by updating isDelete field to true
      await wishlistModel.updateMany({ _id: { $in: ids } }, { isDelete: true });

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
