"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAnalyticService = void 0;
const order_model_1 = require("../../order/order.model");
const restuarant_model_1 = require("../../restuarant/restuarant.model");
const users_model_1 = require("../../users/user/users.model");
const allAdminAnalytic = async () => {
    const totalRestaurant = await restuarant_model_1.RestaurantModel.find({});
    const totalOrder = await order_model_1.OrderModel.find({});
    const totalUser = await users_model_1.userModel.find({});
    return {
        totalRestaurants: totalRestaurant?.length || 0,
        totalOrders: totalOrder?.length || 0,
        totalUsers: totalUser?.length || 0
    };
};
exports.AdminAnalyticService = {
    allAdminAnalytic,
};
