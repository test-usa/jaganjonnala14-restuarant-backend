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
exports.wishlistService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const wishlist_model_1 = require("./wishlist.model");
const wishlist_constant_1 = require("./wishlist.constant");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const product_model_1 = require("../product/product.model");
const config_1 = __importDefault(require("../../config"));
const users_model_1 = require("../users/users.model");
exports.wishlistService = {
    create(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customerExists = yield users_model_1.usersModel.findById(user === null || user === void 0 ? void 0 : user.id);
                if (!customerExists) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Customer not found");
                }
                // Check if the product exists
                const foundProduct = yield product_model_1.productModel.findById(data === null || data === void 0 ? void 0 : data.product);
                if (!foundProduct) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
                }
                // Find the user's wishlist
                let wishlist = yield wishlist_model_1.wishlistModel.findOne({ user: user === null || user === void 0 ? void 0 : user.id });
                if (wishlist) {
                    // If wishlist exists, add the product to the wishlist
                    // Check if product already exists in wishlist
                    if (!wishlist.products.includes(data === null || data === void 0 ? void 0 : data.product)) {
                        wishlist.products.push(data === null || data === void 0 ? void 0 : data.product);
                        yield wishlist.save();
                        return wishlist;
                    }
                    else {
                        throw new Error("Product already in wishlist");
                        // throw new AppError(status.BAD_REQUEST, "Product already in wishlist");
                    }
                }
                else {
                    // If no wishlist exists, create a new one
                    wishlist = new wishlist_model_1.wishlistModel({
                        user: user === null || user === void 0 ? void 0 : user.id,
                        products: [data === null || data === void 0 ? void 0 : data.product],
                    });
                    yield wishlist.save();
                }
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
                const service_query = new QueryBuilder_1.default(wishlist_model_1.wishlistModel.find(), query)
                    .search(wishlist_constant_1.WISHLIST_SEARCHABLE_FIELDS)
                    .filter()
                    .sort()
                    .paginate()
                    .fields();
                const data = yield service_query.modelQuery
                    .populate("user")
                    .populate({
                    path: "products",
                    populate: [
                        { path: "productBrand" }, // Populate productBrand
                        { path: "productCategory" }, // Populate productCategory
                        { path: "productVariants" }, // Populate productVariants
                    ],
                });
                const result = data.map((data) => {
                    var _a;
                    return Object.assign(Object.assign({}, data.toObject()), { products: (_a = data === null || data === void 0 ? void 0 : data.products) === null || _a === void 0 ? void 0 : _a.map((product) => {
                            var _a;
                            const productData = product === null || product === void 0 ? void 0 : product.toObject();
                            return Object.assign(Object.assign({}, productData), { productBrand: Object.assign(Object.assign({}, productData.productBrand), { image: `${config_1.default.base_url}/${(_a = productData.productBrand.image) === null || _a === void 0 ? void 0 : _a.replace(/\\/g, "/")}` }), productFeatureImage: product.productFeatureImage
                                    ? `${config_1.default.base_url}/${product.productFeatureImage.replace(/\\/g, "/")}`
                                    : null, productImages: productData.productImages.map((img) => `${config_1.default.base_url}/${img === null || img === void 0 ? void 0 : img.replace(/\\/g, "/")}`) });
                        }) });
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
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const data = yield wishlist_model_1.wishlistModel
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
                const result = Object.assign(Object.assign({}, data === null || data === void 0 ? void 0 : data.toObject()), { products: (_a = data === null || data === void 0 ? void 0 : data.products) === null || _a === void 0 ? void 0 : _a.map((product) => {
                        var _a;
                        const productData = product === null || product === void 0 ? void 0 : product.toObject();
                        return Object.assign(Object.assign({}, productData), { productBrand: Object.assign(Object.assign({}, productData.productBrand), { image: `${config_1.default.base_url}/${(_a = productData.productBrand.image) === null || _a === void 0 ? void 0 : _a.replace(/\\/g, "/")}` }), productFeatureImage: product.productFeatureImage
                                ? `${config_1.default.base_url}/${product.productFeatureImage.replace(/\\/g, "/")}`
                                : null, productImages: productData.productImages.map((img) => `${config_1.default.base_url}/${img === null || img === void 0 ? void 0 : img.replace(/\\/g, "/")}`) });
                    }) });
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
                const isDeleted = yield wishlist_model_1.wishlistModel.findOne({ _id: data.id });
                if (isDeleted === null || isDeleted === void 0 ? void 0 : isDeleted.isDelete) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "wishlist is already deleted");
                }
                const result = yield wishlist_model_1.wishlistModel.updateOne({ _id: data.id }, data, {
                    new: true,
                });
                if (!result) {
                    throw new Error("wishlist not found.");
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
    delete(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if the user's wishlist exists
                const wishlist = yield wishlist_model_1.wishlistModel.findOne({ user: userId });
                if (!wishlist) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Wishlist not found");
                }
                // Check if the product exists in the wishlist
                const productIndex = wishlist.products.findIndex((product) => product.equals(productId));
                if (productIndex === -1) {
                    throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Product not found in wishlist");
                }
                // Remove the product from the wishlist
                wishlist.products.splice(productIndex, 1);
                // If wishlist is empty after removal, delete the wishlist
                if (wishlist.products.length === 0) {
                    yield wishlist_model_1.wishlistModel.deleteOne({ user: userId });
                    return { message: "Wishlist deleted since it became empty" };
                }
                // Save the updated wishlist
                yield wishlist.save();
                return { message: "Product removed from wishlist" };
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`${error.message}`);
                }
                else {
                    throw new Error("An unknown error occurred while deleting wishlist item.");
                }
            }
        });
    },
    adminDeleteWishlist(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if the wishlist exists
                const wishlist = yield wishlist_model_1.wishlistModel.findById(id);
                if (!wishlist) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Wishlist not found");
                }
                // Check if already deleted
                if (wishlist.isDelete) {
                    throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Wishlist already deleted");
                }
                // Soft delete the wishlist
                const deletedWishlist = yield wishlist_model_1.wishlistModel.findByIdAndUpdate(id, {
                    $set: {
                        isDelete: true,
                        deletedAt: new Date()
                    }
                }, { new: true });
                if (!deletedWishlist) {
                    throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to delete wishlist");
                }
                return deletedWishlist;
            }
            catch (error) {
                if (error instanceof AppError_1.default) {
                    throw error; // Re-throw custom AppError as is
                }
                else if (error instanceof Error) {
                    throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to delete wishlist: ${error.message}`);
                }
                else {
                    throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "An unknown error occurred while deleting wishlist");
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
                // Step 1: Check if the wishlist exist in the database
                const existingwishlist = yield wishlist_model_1.wishlistModel.find({ _id: { $in: ids } });
                if (existingwishlist.length === 0) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No wishlist found with the given IDs");
                }
                // Step 2: Perform soft delete by updating isDelete field to true
                yield wishlist_model_1.wishlistModel.updateMany({ _id: { $in: ids } }, { isDelete: true });
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
