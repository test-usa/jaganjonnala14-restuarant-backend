"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderServices = void 0;
const order_model_1 = require("./order.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const restaurantZone_model_1 = require("../restaurantZone/restaurantZone.model");
const restuarant_model_1 = require("../restuarant/restuarant.model");
const createOrder = async (payload) => {
    const zone = await restaurantZone_model_1.RestaurantZone.findOne({ _id: payload.zone });
    if (!zone) {
        throw new AppError_1.default(400, "zone doesn't found");
    }
    const restaurant = await restuarant_model_1.RestaurantModel.findOne({ _id: payload.restaurant });
    if (!restaurant) {
        throw new AppError_1.default(400, "restaurant doesn't found");
    }
    const result = await order_model_1.OrderModel.create(payload);
    return result;
};
const getAllOrders = async () => {
    const orders = await order_model_1.OrderModel.find({ isDeleted: false });
    return orders;
};
const getSingleOrder = async (id) => {
    const order = await order_model_1.OrderModel.findById(id);
    return order;
};
const updateOrder = async (id, payload) => {
    const updated = await order_model_1.OrderModel.findByIdAndUpdate(id, payload, {
        new: true,
    });
    const findOrder = await order_model_1.OrderModel.findOne({ _id: id });
    if (!findOrder) {
        throw new AppError_1.default(400, "order updated Failed");
    }
    return updated;
};
const deleteOrder = async (id) => {
    const deleted = await order_model_1.OrderModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return deleted;
};
exports.orderServices = {
    createOrder,
    getAllOrders,
    getSingleOrder,
    updateOrder,
    deleteOrder,
};
