/* eslint-disable @typescript-eslint/no-explicit-any */
import { productModel } from "./product.model";
import { PRODUCT_SEARCHABLE_FIELDS } from "./product.constant";
import QueryBuilder from "../../builder/QueryBuilder";
import status from "http-status";
import AppError from "../../errors/AppError";
import config from "../../config";
import { BrandModel } from "../brand/brand.model";
import categoryModel from "../categories/categories.model";

export const productService = {
  async create(data: any) {
    try {
      return await productModel.create(data);
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
      const service_query = new QueryBuilder(productModel.find(), query)
        .search(PRODUCT_SEARCHABLE_FIELDS)
        .filter()
        .sort()
        .paginate()
        .fields();

      let result = await service_query.modelQuery
        .populate("productCategory")
        .populate("productVariants")
        .populate("productBrand");

      // Mongoose Document Instance ke normal object e convert kora
      result = result.map((product: any) => {
        const productData = product.toObject(); // Mongoose instance theke pure object banano

        return {
          ...productData,
          productBrand: {
            ...productData.productBrand,
            image: `${config.base_url}/${productData.productBrand.image?.replace(/\\/g, "/")}`,
          },
          productFeatureImage: `${config.base_url}/${productData.productFeatureImage?.replace(/\\/g, "/")}`,
          productImages: productData.productImages.map(
            (img: string) => `${config.base_url}/${img?.replace(/\\/g, "/")}`
          ),
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
  async filterProducts(query: any) {
    try {
      // �� Extract query parameters
      const {
        pageIndex = 1,
        pageSize = 10,
        sortBy = "createdAt", // Default sorting field
        sortOrder = "desc", // Default sorting order
        isOffer,
        isBestSelling,
      } = query;

      // �� Build filter object
      const filter: any = {isDelete : false};

    

      // Correct:
      if (isOffer === "true") {
        filter.productOfferPrice = { $gt: 0 };
      }

      if (isBestSelling === "true") {
        filter.salesCount = { $gt: 0 };
      }

      const sortOptions: any = { [sortBy]: sortOrder === "desc" ? -1 : 1 };


      // �� Query database with filters, pagination, and sorting
      let result = await productModel
        .find(filter)
        .populate("productCategory")
        .populate("productVariants")
        .populate("productBrand")
        .skip((pageIndex - 1) * pageSize)
        .limit(pageSize)
       .sort(sortOptions);

  


      // �� Modify result for images (convert file paths to URLs)
      result = result.map((product: any) => {
        const productData = product.toObject(); // Mongoose instance theke pure object banano

        return {
          ...productData,
          productBrand: {
            ...productData.productBrand,
            image: `${config.base_url}/${productData.productBrand.image?.replace(/\\/g, "/")}`,
          },
          productFeatureImage: `${config.base_url}/${productData.productFeatureImage?.replace(/\\/g, "/")}`,
          productImages: productData.productImages.map(
            (img: string) => `${config.base_url}/${img?.replace(/\\/g, "/")}`
          ),
        };
      });

      const total = await await productModel.countDocuments(filter);
      const totalPage = Math.ceil(total / pageSize);
  
      return {
        result,
        meta: { pageIndex, pageSize, total,  totalPage },
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },

  async  searchProducts({ pageIndex = 1, pageSize = 5, searchTerm } : any) {


    // First find matching brands and categories
    const matchingBrands = await BrandModel.find({
      name: { $regex: searchTerm, $options: 'i' },
      isDelete: false
    }).select('_id');
  
    const matchingCategories = await categoryModel.find({
      name: { $regex: searchTerm, $options: 'i' },
      isDelete: false
    }).select('_id');
  
    // Convert to arrays of IDs
    const brandIds = matchingBrands.map(b => b._id);
    const categoryIds = matchingCategories.map(c => c._id);
  
    // Search products that match either:
    // - productName/skuCode directly
    // - OR have matching brand ID
    // - OR have matching category ID

const filter = {
  $or: [
    { productName: { $regex: searchTerm, $options: 'i' } },
    { skuCode: { $regex: searchTerm, $options: 'i' } },
    { productBrand: { $in: brandIds } },
    { productCategory: { $in: categoryIds } }
  ],
  isDelete: false
}


    let products : any = await productModel.find(filter)
    .populate({
      path: 'productBrand',
      select: 'name',
      match: { isDelete: false }
    })
    .populate({
      path: 'productCategory',
      select: 'name',
      match: { isDelete: false }
    })
    .exec();
  
    products = products.map((product: any) => {
      const productData = product.toObject();

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
    });

    const total = await productModel.countDocuments(filter);
    const totalPage = Math.ceil(total / pageSize);

    return {
      products,
      meta: { pageIndex, pageSize, total, totalPage },
    };
  },
  async getAllByCategory(query: any) {
    try {
      // 🔹 Extract query parameters
      const {
        pageIndex = 1,
        pageSize = 10,
        searchTerm,
        isDelete,
        id,
        minPrice,
        maxPrice,
        brand,
        startDate,
        endDate,
        sortOrder,
        creationOrder,
      } = query;

      // 🔹 Build filter object
      const filter: any = { productCategory: id };

      if (typeof isDelete !== "undefined") {
        filter.isDelete = isDelete;
      }

      // 🔹 Search Filter (Product Name, SKU, Description)
      if (searchTerm) {
        filter.$or = [
          { productName: { $regex: searchTerm, $options: "i" } },
          { skuCode: { $regex: searchTerm, $options: "i" } },
          { productDescription: { $regex: searchTerm, $options: "i" } },
        ];
      }

      // 🔹 Price Range Filter
      if (minPrice && maxPrice) {
        filter.productSellingPrice = {
          $gte: Number(minPrice),
          $lte: Number(maxPrice),
        };
      }

      // 🔹 Brand Filter
      if (brand && brand !== "null") {
        filter.productBrand = brand;
      }

      // 🔹 Date Filter (Created At)
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          filter.createdAt = {
            $gte: start,
            $lte: end,
          };
        }
      }

      // 🔹 Pagination
      const limit = Number(pageSize) || 10;
      const skip = (Number(pageIndex) - 1) * limit;

      // 🔹 Sorting Configuration
      const sortOptions: any = {};
      if (creationOrder) {
        sortOptions.createdAt = creationOrder === "newest" ? -1 : 1;
      }
      if (sortOrder) {
        sortOptions.productSellingPrice = sortOrder === "lowToHigh" ? 1 : -1;
      }

      // 🔹 Query database with filters, pagination, and sorting
      let result = await productModel
        .find(filter)
        .populate("productCategory")
        .populate("productVariants")
        .populate("productBrand")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      // 🔹 Modify result for images (convert file paths to URLs)
      result = result.map((product: any) => {
        const productData = product.toObject();

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
      });

      // 🔹 Count total documents
      const total = await productModel.countDocuments(filter);
      const totalPage = Math.ceil(total / limit);

      return {
        result,
        meta: { pageIndex, pageSize, total, totalPage },
      };
    } catch (error: any) {
      throw new Error(`Get by category operation failed: ${error.message}`);
    }
  },

  async getById(id: string) {
    try {
      let result: any = await productModel
        .findById(id)
        .populate("productCategory")
        .populate("productVariants")
        .populate("productBrand");

      result = {
        ...result.toObject(),
        productBrand: {
          ...result.productBrand.toObject(),
          image: `${config.base_url}/${result.productBrand.image?.replace(/\\/g, "/")}`,
        },
        productFeatureImage:
          result?.productFeatureImage !== null
            ? `${config.base_url}/${result.productFeatureImage?.replace(/\\/g, "/")}`
            : null,
        productImages: result.productImages.map(
          (img: string) => `${config.base_url}/${img?.replace(/\\/g, "/")}`
        ),
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
      const isDeleted = await productModel.findOne({ _id: data.id });
      if (isDeleted?.isDelete) {
        throw new AppError(status.NOT_FOUND, "product is already deleted");
      }

      const result = await productModel.updateOne({ _id: data.id }, data, {
        new: true,
      });
      if (!result) {
        throw new Error("product not found.");
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

  async delete(id: string) {
    try {
      // Step 1: Check if the product exists in the database
      const isExist = await productModel.findOne({ _id: id });

      if (!isExist) {
        throw new AppError(status.NOT_FOUND, "product not found");
      }

      // Step 4: Delete the home product from the database
      await productModel.updateOne({ _id: id }, { isDelete: true });
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },

  async bulkDelete(ids: string[]) {
    try {
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new Error("Invalid IDs provided");
      }

      // Step 1: Check if the product exist in the database
      const existingproduct = await productModel.find({ _id: { $in: ids } });

      if (existingproduct.length === 0) {
        throw new AppError(
          status.NOT_FOUND,
          "No product found with the given IDs"
        );
      }

      // Step 2: Perform soft delete by updating isDelete field to true
      await productModel.updateMany({ _id: { $in: ids } }, { isDelete: true });

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
