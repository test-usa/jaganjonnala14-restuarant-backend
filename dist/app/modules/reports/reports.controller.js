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
exports.reportsController = exports.getCustomerReport = exports.getInventoryReport = exports.getSalesReport = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const reports_1 = require("../../utils/reports");
const product_model_1 = require("../product/product.model");
const brand_model_1 = require("../brand/brand.model");
const coupon_model_1 = require("../coupon/coupon.model");
const order_model_1 = require("../order/order.model");
const cart_model_1 = require("../cart/cart.model");
const inventoryReport = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const startDate = req.query.startDate
        ? new Date(req.query.startDate)
        : undefined;
    const endDate = req.query.endDate && typeof req.query.endDate === "string"
        ? new Date(req.query.endDate)
        : undefined;
    const reportService = new reports_1.ReportService(5); // Low stock threshold = 5
    // Generate inventory report
    const inventoryReport = yield reportService.generateInventoryReport({
        startDate,
        endDate,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "inventory report generated successfully",
        data: inventoryReport,
    });
}));
const saleReport = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate and parse dates from query parameters
    const startDate = req.query.startDate
        ? new Date(req.query.startDate)
        : new Date(new Date().setDate(new Date().getDate() - 30)); // Default to last 30 days
    const endDate = req.query.endDate
        ? new Date(req.query.endDate)
        : new Date(); // Default to now
    const reportService = new reports_1.ReportService(5); // Low stock threshold = 5
    // Generate inventory report
    const salesReport = yield reportService.generateSalesReport(startDate, endDate, { topProductsLimit: 5, recentOrdersLimit: 5 });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Sales report generated successfully",
        data: salesReport,
    });
}));
// Helper function to get date ranges
const getDateRanges = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    return { today, yesterday, thisMonthStart, lastMonthStart, lastMonthEnd };
};
const getDashboardSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    try {
        const { today, yesterday, thisMonthStart, lastMonthStart, lastMonthEnd } = getDateRanges();
        // Total counts (keep existing)
        const totalProducts = yield product_model_1.productModel.countDocuments({
            isDelete: false,
        });
        const totalBrands = yield brand_model_1.BrandModel.countDocuments({ isDelete: false });
        yield coupon_model_1.couponModel.countDocuments({
            isActive: true,
            isDelete: false,
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() },
        });
        // Order statistics (keep existing)
        const totalOrders = yield order_model_1.orderModel.countDocuments();
        const pendingOrders = yield order_model_1.orderModel.countDocuments({
            status: "pending",
        });
        const completedOrders = yield order_model_1.orderModel.countDocuments({
            status: "completed",
        });
        // Enhanced financial stats calculation
        const calculateFinancials = (matchQuery) => __awaiter(void 0, void 0, void 0, function* () {
            return yield order_model_1.orderModel.aggregate([
                { $match: Object.assign(Object.assign({}, matchQuery), { status: "completed" }) },
                { $unwind: "$items" },
                {
                    $lookup: {
                        from: "products",
                        localField: "items.product",
                        foreignField: "_id",
                        as: "productData",
                    },
                },
                { $unwind: "$productData" },
                {
                    $group: {
                        _id: "$_id",
                        orderTotal: { $first: "$total" },
                        deliveryFee: { $first: "$delivery.fee" },
                        productCost: {
                            $sum: {
                                $multiply: [
                                    "$items.quantity",
                                    "$productData.productBuyingPrice",
                                ],
                            },
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        revenue: { $sum: "$orderTotal" },
                        totalDeliveryFees: { $sum: "$deliveryFee" },
                        totalProductCosts: { $sum: "$productCost" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        revenue: 1,
                        profit: {
                            $subtract: [
                                "$revenue",
                                { $add: ["$totalProductCosts", "$totalDeliveryFees"] },
                            ],
                        },
                    },
                },
            ]);
        });
        // Today's stats
        const todayOrders = yield order_model_1.orderModel.countDocuments({
            createdAt: { $gte: today },
        });
        const todayFinancials = yield calculateFinancials({
            createdAt: { $gte: today },
        });
        // Yesterday's stats
        const yesterdayFinancials = yield calculateFinancials({
            createdAt: { $gte: yesterday, $lt: today },
        });
        // Monthly stats
        const thisMonthFinancials = yield calculateFinancials({
            createdAt: { $gte: thisMonthStart },
        });
        const lastMonthFinancials = yield calculateFinancials({
            createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
        });
        // Best selling products (keep existing)
        const bestSellers = yield product_model_1.productModel
            .find({ isDelete: false })
            .sort({ salesCount: -1 })
            .limit(5)
            .populate("productBrand", "name")
            .populate("productCategory", "name");
        // Recent orders (keep existing)
        const recentOrders = yield order_model_1.orderModel
            .find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("customerId", "name email");
        // Abandoned carts (keep existing)
        const abandonedCarts = yield cart_model_1.cartModel.countDocuments({
            isCheckout: false,
            updatedAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        });
        // Coupon usage (keep existing)
        const couponUsage = yield coupon_model_1.couponModel.aggregate([
            { $match: { isDelete: false } },
            {
                $group: {
                    _id: null,
                    totalCoupons: { $sum: 1 },
                    totalUsed: { $sum: "$usedCount" },
                    activeCoupons: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ["$isActive", true] },
                                        { $lte: ["$startDate", new Date()] },
                                        { $gte: ["$endDate", new Date()] },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
        ]);
        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalProducts,
                    totalBrands,
                    activeCoupons: ((_a = couponUsage[0]) === null || _a === void 0 ? void 0 : _a.activeCoupons) || 0,
                    totalOrders,
                    pendingOrders,
                    completedOrders,
                    abandonedCarts,
                    couponUsage: ((_b = couponUsage[0]) === null || _b === void 0 ? void 0 : _b.totalUsed) || 0,
                },
                revenue: {
                    today: ((_c = todayFinancials[0]) === null || _c === void 0 ? void 0 : _c.revenue) || 0,
                    yesterday: ((_d = yesterdayFinancials[0]) === null || _d === void 0 ? void 0 : _d.revenue) || 0,
                    thisMonth: ((_e = thisMonthFinancials[0]) === null || _e === void 0 ? void 0 : _e.revenue) || 0,
                    lastMonth: ((_f = lastMonthFinancials[0]) === null || _f === void 0 ? void 0 : _f.revenue) || 0,
                    todayOrders,
                },
                profit: {
                    today: ((_g = todayFinancials[0]) === null || _g === void 0 ? void 0 : _g.profit) || 0,
                    yesterday: ((_h = yesterdayFinancials[0]) === null || _h === void 0 ? void 0 : _h.profit) || 0,
                    thisMonth: ((_j = thisMonthFinancials[0]) === null || _j === void 0 ? void 0 : _j.profit) || 0,
                    lastMonth: ((_k = lastMonthFinancials[0]) === null || _k === void 0 ? void 0 : _k.profit) || 0,
                },
                bestSellers,
                recentOrders,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to load dashboard data",
        });
    }
});
const getSalesReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        const matchStage = { status: "completed" };
        if (startDate && endDate) {
            matchStage.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }
        const salesData = yield order_model_1.orderModel.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    },
                    totalSales: { $sum: "$total" },
                    orderCount: { $sum: 1 },
                    averageOrderValue: { $avg: "$total" },
                },
            },
            { $sort: { "_id.date": 1 } },
            {
                $project: {
                    date: "$_id.date",
                    totalSales: 1,
                    orderCount: 1,
                    averageOrderValue: { $round: ["$averageOrderValue", 2] },
                    _id: 0,
                },
            },
        ]);
        // Get top selling products
        const topProducts = yield order_model_1.orderModel.aggregate([
            { $match: matchStage },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    totalQuantity: { $sum: "$items.quantity" },
                    totalRevenue: {
                        $sum: { $multiply: ["$items.quantity", "$items.price"] },
                    },
                },
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
            {
                $project: {
                    productName: "$product.productName",
                    totalQuantity: 1,
                    totalRevenue: 1,
                    _id: 0,
                },
            },
        ]);
        res.status(200).json({
            success: true,
            data: {
                salesData,
                topProducts,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to generate sales report",
        });
    }
});
exports.getSalesReport = getSalesReport;
const getInventoryReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Low stock products (less than 10 in stock)
        const lowStockProducts = yield product_model_1.productModel
            .find({
            productStock: { $lt: 10 },
            isDelete: false,
        })
            .sort({ productStock: 1 })
            .limit(20)
            .populate("productBrand", "name")
            .populate("productCategory", "name");
        // Out of stock products
        const outOfStockProducts = yield product_model_1.productModel
            .find({
            productStock: 0,
            isDelete: false,
        })
            .populate("productBrand", "name")
            .populate("productCategory", "name");
        // Stock value by category
        const stockValueByCategory = yield product_model_1.productModel.aggregate([
            { $match: { isDelete: false } },
            {
                $group: {
                    _id: "$productCategory",
                    totalStock: { $sum: "$productStock" },
                    stockValue: {
                        $sum: { $multiply: ["$productStock", "$productBuyingPrice"] },
                    },
                    productCount: { $sum: 1 },
                },
            },
            { $sort: { stockValue: -1 } },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "category",
                },
            },
            { $unwind: "$category" },
            {
                $project: {
                    category: "$category.name",
                    totalStock: 1,
                    stockValue: 1,
                    productCount: 1,
                    _id: 0,
                },
            },
        ]);
        res.status(200).json({
            success: true,
            data: {
                lowStockProducts,
                outOfStockProducts,
                stockValueByCategory,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to generate inventory report",
        });
    }
});
exports.getInventoryReport = getInventoryReport;
const getCustomerReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Top customers by order count and spending
        const topCustomers = yield order_model_1.orderModel.aggregate([
            { $match: { status: "completed" } },
            {
                $group: {
                    _id: "$customerId",
                    orderCount: { $sum: 1 },
                    totalSpending: { $sum: "$total" },
                },
            },
            { $sort: { totalSpending: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "customer",
                },
            },
            { $unwind: "$customer" },
            {
                $project: {
                    customerName: "$customer.name",
                    email: "$customer.email",
                    orderCount: 1,
                    totalSpending: 1,
                    _id: 0,
                },
            },
        ]);
        // Customer acquisition over time
        const customerAcquisition = yield order_model_1.orderModel.aggregate([
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                        customer: "$customerId",
                    },
                },
            },
            {
                $group: {
                    _id: "$_id.date",
                    newCustomers: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    month: "$_id",
                    newCustomers: 1,
                    _id: 0,
                },
            },
        ]);
        res.status(200).json({
            success: true,
            data: {
                topCustomers,
                customerAcquisition,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to generate customer report",
        });
    }
});
exports.getCustomerReport = getCustomerReport;
exports.reportsController = {
    inventoryReport,
    saleReport,
    getDashboardSummary,
};
