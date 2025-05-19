"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticService = void 0;
const order_model_1 = require("../../order/order.model");
const restuarant_model_1 = require("../../restuarant/restuarant.model");
const allAnalytic = async (restaurantId) => {
    const orders = await order_model_1.OrderModel.find({
        restaurant: restaurantId,
        isDeleted: false,
    });
    if (!orders || orders.length === 0) {
        return {
            totalRevenue: 0,
            averageOrderValue: 0,
            totalOrders: 0,
            averageCustomerRating: 0,
        };
    }
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalRevenue / totalOrders;
    //for admin
    const totalRestaurant = await restuarant_model_1.RestaurantModel.find({});
    console.log(totalRestaurant);
    return {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        averageOrderValue: Number(averageOrderValue.toFixed(2)),
        totalOrders,
        averageCustomerRating: 4.2,
    };
};
exports.analyticService = {
    allAnalytic,
};
