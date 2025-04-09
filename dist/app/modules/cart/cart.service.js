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
exports.cartService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const cart_model_1 = require("./cart.model");
const cart_constant_1 = require("./cart.constant");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const product_model_1 = require("../product/product.model");
const config_1 = __importDefault(require("../../config"));
exports.cartService = {
    create(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 1️⃣ Product Fetch kore stock check korbo
                const product = (yield product_model_1.productModel.findById(data.product));
                if (!product) {
                    throw new Error("Product not found");
                }
                // 2️⃣ Cart check korbo
                const isCartExist = yield cart_model_1.cartModel.findOne({
                    user: user,
                    isCheckout: false,
                    isDelete: false,
                });
                if (isCartExist) {
                    const isProductExist = isCartExist.products.find((product) => product.product.toString() === data.product);
                    if (isProductExist) {
                        // 3️⃣ Cart e already product thakle: (existing quantity + new quantity) er stock check korbo
                        const newQuantity = isProductExist.quantity + 1; // Frontend theke always 1 asteche
                        if (product.productStock < newQuantity) {
                            throw new Error("Not enough stock available");
                        }
                        isProductExist.quantity = newQuantity;
                        isProductExist.totalPrice =
                            isProductExist.quantity * isProductExist.price;
                        isCartExist.cartTotalCost += isProductExist.price;
                        yield isCartExist.save();
                        return isCartExist;
                    }
                    // 4️⃣ Jodi cart e na thake, tahole stock check kore add korbo
                    if (product.productStock < 1) {
                        throw new Error("Not enough stock available");
                    }
                    isCartExist.products.push(Object.assign(Object.assign({}, data), { quantity: 1, totalPrice: data.price }));
                    isCartExist.cartTotalCost += data.price;
                    yield isCartExist.save();
                    return isCartExist;
                }
                // 5️⃣ Jodi cart notun hoy, tahole create korbo with stock check
                if (product.productStock < 1) {
                    throw new Error("Not enough stock available");
                }
                const newCart = new cart_model_1.cartModel({
                    user: user,
                    products: [Object.assign(Object.assign({}, data), { quantity: 1, totalPrice: data.price })],
                    cartTotalCost: data.price,
                });
                yield newCart.save();
                return newCart;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`${error.message}`);
                }
                else {
                    throw new Error("An unknown error occurred while processing the cart.");
                }
            }
        });
    },
    removeFromCart(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 1️⃣ Cart check korbo
                const isCartExist = yield cart_model_1.cartModel.findOne({
                    user: user,
                    isCheckout: false,
                    isDelete: false,
                });
                if (!isCartExist) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Cart not found");
                }
                // 2️��� Product remove korbo
                const productIndex = isCartExist.products.findIndex((product) => product.product.toString() === data.product);
                if (productIndex === -1) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found in the cart");
                }
                const product = isCartExist.products[productIndex];
                if (product.quantity > 1) {
                    // 3️⃣ Jodi quantity 1 er beshi hoy, tahole quantity komabo
                    product.quantity -= 1;
                    product.totalPrice = product.quantity * product.price;
                    isCartExist.cartTotalCost -= product.price;
                    yield isCartExist.save();
                    return isCartExist;
                }
                // 4️⃣ Jodi quantity 1 hoy, tahole product remove korbo
                isCartExist.cartTotalCost -= product.totalPrice;
                isCartExist.products.splice(productIndex, 1);
                yield isCartExist.save();
                return isCartExist;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`${error.message}`);
                }
                else {
                    throw new Error("An unknown error occurred while processing the cart.");
                }
            }
        });
    },
    getAll(query, userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const service_query = new QueryBuilder_1.default(cart_model_1.cartModel.find({
                    user: userid,
                    isCheckout: false,
                    isDelete: query === null || query === void 0 ? void 0 : query.isDelete,
                }), query)
                    .search(cart_constant_1.CART_SEARCHABLE_FIELDS)
                    .filter()
                    .sort()
                    .paginate()
                    .fields();
                const result = yield service_query.modelQuery;
                const meta = yield service_query.countTotal();
                return {
                    result,
                    meta,
                };
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(` ${error.message}`);
                }
                else {
                    throw new Error("An unknown error occurred while fetching by ID.");
                }
            }
        });
    },
    adminGetAllCart(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const service_query = new QueryBuilder_1.default(cart_model_1.cartModel.find({
                    isDelete: query === null || query === void 0 ? void 0 : query.isDelete,
                }), query)
                    .search(cart_constant_1.CART_SEARCHABLE_FIELDS)
                    .filter()
                    .sort()
                    .paginate()
                    .fields();
                const result = yield service_query.modelQuery.populate("user").populate({
                    path: "products.product",
                    model: "product", // Explicitly specify the model name
                });
                const meta = yield service_query.countTotal();
                return {
                    result,
                    meta,
                };
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(` ${error.message}`);
                }
                else {
                    throw new Error("An unknown error occurred while fetching by ID.");
                }
            }
        });
    },
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield cart_model_1.cartModel
                    .findOne({
                    user: id,
                    isCheckout: false,
                    isDelete: false,
                })
                    .populate({
                    path: "products.product",
                    model: "product", // Explicitly specify the model name
                });
                result = Object.assign(Object.assign({}, result === null || result === void 0 ? void 0 : result.toObject()), { products: result.products.map((product) => {
                        var _a, _b, _c;
                        const productData = (_a = product.product) === null || _a === void 0 ? void 0 : _a.toObject(); // Mongoose instance theke pure object banano
                        return Object.assign(Object.assign({}, product === null || product === void 0 ? void 0 : product.toObject()), { product: Object.assign(Object.assign({}, productData), { productBrand: Object.assign(Object.assign({}, productData.productBrand), { image: `${config_1.default.base_url}/${(_b = productData.productBrand.image) === null || _b === void 0 ? void 0 : _b.replace(/\\/g, "/")}` }), productFeatureImage: productData.productFeatureImage !== null &&
                                    `${config_1.default.base_url}/${(_c = productData.productFeatureImage) === null || _c === void 0 ? void 0 : _c.replace(/\\/g, "/")}`, productImages: productData.productImages.map((img) => `${config_1.default.base_url}/${img === null || img === void 0 ? void 0 : img.replace(/\\/g, "/")}`) }) });
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
                const isDeleted = yield cart_model_1.cartModel.findOne({ _id: data.id });
                if (isDeleted === null || isDeleted === void 0 ? void 0 : isDeleted.isDelete) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "cart is already deleted");
                }
                const result = yield cart_model_1.cartModel.updateOne({ _id: data.id }, data, {
                    new: true,
                });
                if (!result) {
                    throw new Error("cart not found.");
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
    delete(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Step 1: Check if the cart exists in the database
                const isExist = yield cart_model_1.cartModel.findOne({ user: user });
                if (!isExist) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Cart not found");
                }
                // Step 2: Find the product to remove in the cart
                const productIndex = isExist.products.findIndex((product) => product.product.toString() === id);
                if (productIndex === -1) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found in the cart");
                }
                // Step 3: Get the product's totalPrice and remove the product from the cart
                const product = isExist.products[productIndex];
                isExist.cartTotalCost -= product.totalPrice; // Subtract product total price from cart total cost
                isExist.products.splice(productIndex, 1); // Remove the product from the cart
                // Step 4: Save the updated cart
                yield isExist.save();
                return isExist; // Return the updated cart
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Delete operation failed: ${error.message}`);
                }
                else {
                    throw new Error("An unknown error occurred while deleting the product.");
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
                // Step 1: Check if the cart exist in the database
                const existingcart = yield cart_model_1.cartModel.find({ _id: { $in: ids } });
                if (existingcart.length === 0) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No cart found with the given IDs");
                }
                // Step 2: Perform soft delete by updating isDelete field to true
                yield cart_model_1.cartModel.updateMany({ _id: { $in: ids } }, { isDelete: true });
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
