"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const product_model_1 = require("./product.model");
const product_constant_1 = require("./product.constant");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const config_1 = __importDefault(require("../../config"));
const brand_model_1 = require("../brand/brand.model");
const categories_model_1 = __importDefault(require("../categories/categories.model"));
exports.productService = {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield product_model_1.productModel.create(data);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`${error.message}`);
                }
                else {
                    throw new Error("An unknown error occurred while fetching by ID.");
                }
            }
        });
    },
    getAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const service_query = new QueryBuilder_1.default(product_model_1.productModel.find(), query)
                    .search(product_constant_1.PRODUCT_SEARCHABLE_FIELDS)
                    .filter()
                    .sort()
                    .paginate()
                    .fields();
                let result = yield service_query.modelQuery
                    .populate("productCategory")
                    .populate("productUnit")
                    .populate("variant")
                    .populate("variantcolor")
                    .populate("productBrand");
                // Mongoose Document Instance ke normal object e convert kora
                result = result.map((product) => {
                    var _a, _b;
                    const productData = product.toObject(); // Mongoose instance theke pure object banano
                    return Object.assign(Object.assign({}, productData), { productBrand: Object.assign(Object.assign({}, productData.productBrand), { image: `${config_1.default.base_url}/${(_a = productData.productBrand.image) === null || _a === void 0 ? void 0 : _a.replace(/\\/g, "/")}` }), productFeatureImage: `${config_1.default.base_url}/${(_b = productData.productFeatureImage) === null || _b === void 0 ? void 0 : _b.replace(/\\/g, "/")}`, productImages: productData.productImages.map((img) => `${config_1.default.base_url}/${img === null || img === void 0 ? void 0 : img.replace(/\\/g, "/")}`) });
                });
                const meta = yield service_query.countTotal();
                return {
                    result,
                    meta,
                };
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`${error.message}`);
                }
                else {
                    throw new Error("An unknown error occurred while fetching by ID.");
                }
            }
        });
    },
    filterProducts(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // �� Extract query parameters
                const { pageIndex = 1, pageSize = 10, sortBy = "createdAt", // Default sorting field
                sortOrder = "desc", // Default sorting order
                isOffer, isBestSelling, } = query;
                // �� Build filter object
                const filter = { isDelete: false };
                // Correct:
                if (isOffer === "true") {
                    filter.productOfferPrice = { $gt: 0 };
                }
                if (isBestSelling === "true") {
                    filter.salesCount = { $gt: 0 };
                }
                const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };
                // �� Query database with filters, pagination, and sorting
                let result = yield product_model_1.productModel
                    .find(filter)
                    .populate("productCategory")
                    .populate("productUnit")
                    .populate("variant")
                    .populate("variantcolor")
                    .populate("productBrand")
                    .skip((pageIndex - 1) * pageSize)
                    .limit(pageSize)
                    .sort(sortOptions);
                // �� Modify result for images (convert file paths to URLs)
                result = result.map((product) => {
                    var _a, _b;
                    const productData = product.toObject(); // Mongoose instance theke pure object banano
                    return Object.assign(Object.assign({}, productData), { productBrand: Object.assign(Object.assign({}, productData.productBrand), { image: `${config_1.default.base_url}/${(_a = productData.productBrand.image) === null || _a === void 0 ? void 0 : _a.replace(/\\/g, "/")}` }), productFeatureImage: `${config_1.default.base_url}/${(_b = productData.productFeatureImage) === null || _b === void 0 ? void 0 : _b.replace(/\\/g, "/")}`, productImages: productData.productImages.map((img) => `${config_1.default.base_url}/${img === null || img === void 0 ? void 0 : img.replace(/\\/g, "/")}`) });
                });
                const total = yield yield product_model_1.productModel.countDocuments(filter);
                const totalPage = Math.ceil(total / pageSize);
                return {
                    result,
                    meta: { pageIndex, pageSize, total, totalPage },
                };
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`${error.message}`);
                }
                else {
                    throw new Error("An unknown error occurred while fetching by ID.");
                }
            }
        });
    },
    searchProducts(_a) {
        return __awaiter(this, arguments, void 0, function* ({ pageIndex = 1, pageSize = 5, searchTerm }) {
            // First find matching brands and categories
            const matchingBrands = yield brand_model_1.BrandModel.find({
                name: { $regex: searchTerm, $options: 'i' },
                isDelete: false
            }).select('_id');
            const matchingCategories = yield categories_model_1.default.find({
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
            };
            let products = yield product_model_1.productModel.find(filter)
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
            products = products.map((product) => {
                var _a;
                const productData = product.toObject();
                return Object.assign(Object.assign({}, productData), { productBrand: Object.assign(Object.assign({}, productData.productBrand), { image: `${config_1.default.base_url}/${(_a = productData.productBrand.image) === null || _a === void 0 ? void 0 : _a.replace(/\\/g, "/")}` }), productFeatureImage: product.productFeatureImage
                        ? `${config_1.default.base_url}/${product.productFeatureImage.replace(/\\/g, "/")}`
                        : null, productImages: productData.productImages.map((img) => `${config_1.default.base_url}/${img === null || img === void 0 ? void 0 : img.replace(/\\/g, "/")}`) });
            });
            const total = yield product_model_1.productModel.countDocuments(filter);
            const totalPage = Math.ceil(total / pageSize);
            return {
                products,
                meta: { pageIndex, pageSize, total, totalPage },
            };
        });
    },
    getAllByCategory(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 🔹 Extract query parameters
                const { pageIndex = 1, pageSize = 10, searchTerm, isDelete, id, minPrice, maxPrice, brand, startDate, endDate, sortOrder, creationOrder, } = query;
                // 🔹 Build filter object
                const filter = { productCategory: id };
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
                const sortOptions = {};
                if (creationOrder) {
                    sortOptions.createdAt = creationOrder === "newest" ? -1 : 1;
                }
                if (sortOrder) {
                    sortOptions.productSellingPrice = sortOrder === "lowToHigh" ? 1 : -1;
                }
                // 🔹 Query database with filters, pagination, and sorting
                let result = yield product_model_1.productModel
                    .find(filter)
                    .populate("productCategory")
                    .populate("productUnit")
                    .populate("variant")
                    .populate("variantcolor")
                    .populate("productBrand")
                    .sort(sortOptions)
                    .skip(skip)
                    .limit(limit);
                // 🔹 Modify result for images (convert file paths to URLs)
                result = result.map((product) => {
                    var _a;
                    const productData = product.toObject();
                    return Object.assign(Object.assign({}, productData), { productBrand: Object.assign(Object.assign({}, productData.productBrand), { image: `${config_1.default.base_url}/${(_a = productData.productBrand.image) === null || _a === void 0 ? void 0 : _a.replace(/\\/g, "/")}` }), productFeatureImage: product.productFeatureImage
                            ? `${config_1.default.base_url}/${product.productFeatureImage.replace(/\\/g, "/")}`
                            : null, productImages: productData.productImages.map((img) => `${config_1.default.base_url}/${img === null || img === void 0 ? void 0 : img.replace(/\\/g, "/")}`) });
                });
                // 🔹 Count total documents
                const total = yield product_model_1.productModel.countDocuments(filter);
                const totalPage = Math.ceil(total / limit);
                return {
                    result,
                    meta: { pageIndex, pageSize, total, totalPage },
                };
            }
            catch (error) {
                throw new Error(`Get by category operation failed: ${error.message}`);
            }
        });
    },
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                let result = yield product_model_1.productModel
                    .findById(id)
                    .populate("productCategory")
                    .populate("productUnit")
                    .populate("variant")
                    .populate("variantcolor")
                    .populate("productBrand");
                result = Object.assign(Object.assign({}, result.toObject()), { productBrand: Object.assign(Object.assign({}, result.productBrand.toObject()), { image: `${config_1.default.base_url}/${(_a = result.productBrand.image) === null || _a === void 0 ? void 0 : _a.replace(/\\/g, "/")}` }), productFeatureImage: (result === null || result === void 0 ? void 0 : result.productFeatureImage) !== null
                        ? `${config_1.default.base_url}/${(_b = result.productFeatureImage) === null || _b === void 0 ? void 0 : _b.replace(/\\/g, "/")}`
                        : null, productImages: result.productImages.map((img) => `${config_1.default.base_url}/${img === null || img === void 0 ? void 0 : img.replace(/\\/g, "/")}`) });
                return result;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`${error.message}`);
                }
                else {
                    throw new Error("An unknown error occurred while fetching by ID.");
                }
            }
        });
    },
    update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isDeleted = yield product_model_1.productModel.findOne({ _id: data.id });
                if (isDeleted === null || isDeleted === void 0 ? void 0 : isDeleted.isDelete) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "product is already deleted");
                }
                const result = yield product_model_1.productModel.updateOne({ _id: data.id }, data, {
                    new: true,
                });
                if (!result) {
                    throw new Error("product not found.");
                }
                return result;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`${error.message}`);
                }
                else {
                    throw new Error("An unknown error occurred while fetching by ID.");
                }
            }
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Step 1: Check if the product exists in the database
                const isExist = yield product_model_1.productModel.findOne({ _id: id });
                if (!isExist) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "product not found");
                }
                // Step 4: Delete the home product from the database
                yield product_model_1.productModel.updateOne({ _id: id }, { isDelete: true });
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`${error.message}`);
                }
                else {
                    throw new Error("An unknown error occurred while fetching by ID.");
                }
            }
        });
    },
    bulkDelete(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!ids || !Array.isArray(ids) || ids.length === 0) {
                    throw new Error("Invalid IDs provided");
                }
                // Step 1: Check if the product exist in the database
                const existingproduct = yield product_model_1.productModel.find({ _id: { $in: ids } });
                if (existingproduct.length === 0) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No product found with the given IDs");
                }
                // Step 2: Perform soft delete by updating isDelete field to true
                yield product_model_1.productModel.updateMany({ _id: { $in: ids } }, { isDelete: true });
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`${error.message}`);
                }
                else {
                    throw new Error("An unknown error occurred while fetching by ID.");
                }
            }
        });
    },
};
