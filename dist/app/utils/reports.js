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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const order_model_1 = require("../modules/order/order.model");
const product_model_1 = require("../modules/product/product.model");
class ReportService {
    constructor(lowStockThreshold = 10) {
        this.lowStockThreshold = lowStockThreshold;
    }
    generateInventoryReport(dateRange) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Base match query for non-deleted products
                const baseMatch = { isDelete: false };
                // Add date filter if provided
                if ((dateRange === null || dateRange === void 0 ? void 0 : dateRange.startDate) || (dateRange === null || dateRange === void 0 ? void 0 : dateRange.endDate)) {
                    baseMatch.createdAt = {};
                    if (dateRange.startDate)
                        baseMatch.createdAt.$gte = new Date(dateRange.startDate);
                    if (dateRange.endDate)
                        baseMatch.createdAt.$lte = new Date(dateRange.endDate);
                }
                // Get all products with populated category and brand
                const products = yield product_model_1.productModel.aggregate([
                    { $match: baseMatch },
                    {
                        $lookup: {
                            from: 'categories',
                            localField: 'productCategory',
                            foreignField: '_id',
                            as: 'category'
                        }
                    },
                    {
                        $lookup: {
                            from: 'brands',
                            localField: 'productBrand',
                            foreignField: '_id',
                            as: 'brand'
                        }
                    },
                    { $unwind: '$category' },
                    { $unwind: '$brand' },
                    {
                        $addFields: {
                            convertedStock: { $toDouble: '$productStock' },
                            convertedBuyingPrice: { $toDouble: '$productBuyingPrice' },
                            convertedSellingPrice: { $toDouble: '$productSellingPrice' },
                            convertedOfferPrice: { $toDouble: '$productOfferPrice' }
                        }
                    },
                    {
                        $project: {
                            productName: 1,
                            skuCode: 1,
                            'category.name': 1,
                            'category.type': 1,
                            'brand.name': 1,
                            'brand.isFeatured': 1,
                            productStock: '$convertedStock',
                            productBuyingPrice: '$convertedBuyingPrice',
                            productSellingPrice: '$convertedSellingPrice',
                            productOfferPrice: '$convertedOfferPrice',
                            stockValue: { $multiply: ['$convertedStock', '$convertedBuyingPrice'] },
                            potentialRevenue: { $multiply: ['$convertedStock', '$convertedSellingPrice'] },
                            status: {
                                $cond: {
                                    if: { $eq: ['$convertedStock', 0] },
                                    then: 'Out of Stock',
                                    else: {
                                        $cond: {
                                            if: { $lt: ['$convertedStock', this.lowStockThreshold] },
                                            then: 'Low Stock',
                                            else: 'In Stock'
                                        }
                                    }
                                }
                            },
                            createdAt: 1 // Include for date filtering in frontend
                        }
                    }
                ]);
                // Calculate summary statistics
                const summary = {
                    totalProducts: products.length,
                    outOfStock: products.filter(p => p.status === 'Out of Stock').length,
                    lowStock: products.filter(p => p.status === 'Low Stock').length,
                    totalStockValue: products.reduce((sum, p) => sum + (Number(p.stockValue) || 0), 0),
                    totalPotentialRevenue: products.reduce((sum, p) => sum + (Number(p.potentialRevenue) || 0), 0),
                    dateRange: {
                        start: (dateRange === null || dateRange === void 0 ? void 0 : dateRange.startDate) || null,
                        end: (dateRange === null || dateRange === void 0 ? void 0 : dateRange.endDate) || null
                    }
                };
                // Group by category
                const categorySummary = yield product_model_1.productModel.aggregate([
                    { $match: baseMatch },
                    {
                        $lookup: {
                            from: 'categories',
                            localField: 'productCategory',
                            foreignField: '_id',
                            as: 'category'
                        }
                    },
                    { $unwind: '$category' },
                    {
                        $addFields: {
                            convertedStock: { $toDouble: '$productStock' },
                            convertedBuyingPrice: { $toDouble: '$productBuyingPrice' }
                        }
                    },
                    {
                        $group: {
                            _id: {
                                name: '$category.name',
                                type: '$category.type'
                            },
                            productCount: { $sum: 1 },
                            stockValue: { $sum: { $multiply: ['$convertedStock', '$convertedBuyingPrice'] } }
                        }
                    },
                    {
                        $project: {
                            name: '$_id.name',
                            type: '$_id.type',
                            productCount: 1,
                            stockValue: { $toDouble: '$stockValue' },
                            _id: 0
                        }
                    },
                    { $sort: { stockValue: -1 } }
                ]);
                // Group by brand
                const brandSummary = yield product_model_1.productModel.aggregate([
                    { $match: baseMatch },
                    {
                        $lookup: {
                            from: 'brands',
                            localField: 'productBrand',
                            foreignField: '_id',
                            as: 'brand'
                        }
                    },
                    { $unwind: '$brand' },
                    {
                        $addFields: {
                            convertedStock: { $toDouble: '$productStock' },
                            convertedBuyingPrice: { $toDouble: '$productBuyingPrice' }
                        }
                    },
                    {
                        $group: {
                            _id: {
                                name: '$brand.name',
                                isFeatured: '$brand.isFeatured'
                            },
                            productCount: { $sum: 1 },
                            stockValue: { $sum: { $multiply: ['$convertedStock', '$convertedBuyingPrice'] } }
                        }
                    },
                    {
                        $project: {
                            name: '$_id.name',
                            isFeatured: '$_id.isFeatured',
                            productCount: 1,
                            stockValue: { $toDouble: '$stockValue' },
                            _id: 0
                        }
                    },
                    { $sort: { stockValue: -1 } }
                ]);
                return {
                    summary,
                    categorySummary,
                    brandSummary,
                    productDetails: products.map(p => ({
                        productName: p.productName,
                        skuCode: p.skuCode,
                        category: p.category.name,
                        brand: p.brand.name,
                        currentStock: Number(p.productStock) || 0,
                        buyingPrice: Number(p.productBuyingPrice) || 0,
                        sellingPrice: Number(p.productSellingPrice) || 0,
                        offerPrice: Number(p.productOfferPrice) || 0,
                        stockValue: Number(p.stockValue) || 0,
                        status: p.status,
                        createdAt: p.createdAt // Include for frontend display
                    }))
                };
            }
            catch (error) {
                throw new Error(`Failed to generate inventory report: ${error.message}`);
            }
        });
    }
    generateSalesReport(startDate_1, endDate_1) {
        return __awaiter(this, arguments, void 0, function* (startDate, endDate, options = {}) {
            const { topProductsLimit = 10, recentOrdersLimit = 10 } = options;
            try {
                // Validate dates
                if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
                    throw new Error('Invalid date parameters');
                }
                if (startDate > endDate) {
                    throw new Error('Start date cannot be after end date');
                }
                // Get order summary
                const [orderSummary, topProducts, recentOrders] = yield Promise.all([
                    // Order summary aggregation
                    order_model_1.orderModel.aggregate([
                        {
                            $match: {
                                createdAt: { $gte: startDate, $lte: endDate },
                                status: { $ne: 'cancelled' }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                totalOrders: { $sum: 1 },
                                totalRevenue: { $sum: { $toDouble: '$total' } },
                                paymentMethods: {
                                    $push: {
                                        type: '$payment.type',
                                        method: '$payment.method'
                                    }
                                },
                                orderStatuses: { $push: '$status' }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                totalOrders: 1,
                                totalRevenue: 1,
                                averageOrderValue: {
                                    $cond: [
                                        { $eq: ['$totalOrders', 0] },
                                        0,
                                        { $divide: ['$totalRevenue', '$totalOrders'] }
                                    ]
                                },
                                paymentMethods: 1,
                                orderStatuses: 1
                            }
                        }
                    ]),
                    // Top products aggregation
                    order_model_1.orderModel.aggregate([
                        {
                            $match: {
                                createdAt: { $gte: startDate, $lte: endDate },
                                status: { $ne: 'cancelled' }
                            }
                        },
                        { $unwind: '$items' },
                        {
                            $lookup: {
                                from: 'products',
                                localField: 'items.product',
                                foreignField: '_id',
                                as: 'product'
                            }
                        },
                        { $unwind: '$product' },
                        {
                            $group: {
                                _id: '$items.product',
                                productName: { $first: '$product.productName' },
                                skuCode: { $first: '$product.skuCode' },
                                quantitySold: { $sum: { $toInt: '$items.quantity' } },
                                totalRevenue: {
                                    $sum: {
                                        $multiply: [
                                            { $toInt: '$items.quantity' },
                                            { $toDouble: '$items.price' }
                                        ]
                                    }
                                }
                            }
                        },
                        { $sort: { totalRevenue: -1 } },
                        { $limit: topProductsLimit },
                        {
                            $project: {
                                _id: 0,
                                productName: 1,
                                skuCode: 1,
                                quantitySold: 1,
                                totalRevenue: 1
                            }
                        }
                    ]),
                    // Recent orders query
                    order_model_1.orderModel.find({
                        createdAt: { $gte: startDate, $lte: endDate }
                    })
                        .sort({ createdAt: -1 })
                        .limit(recentOrdersLimit)
                        .lean()
                ]);
                // Process payment methods and order statuses
                const paymentMethods = {};
                const orderStatuses = {};
                const summary = orderSummary[0] || {
                    totalOrders: 0,
                    totalRevenue: 0,
                    averageOrderValue: 0,
                    paymentMethods: [],
                    orderStatuses: []
                };
                summary.paymentMethods.forEach((pm) => {
                    const key = pm.method ? `${pm.type} (${pm.method})` : pm.type;
                    paymentMethods[key] = (paymentMethods[key] || 0) + 1;
                });
                summary.orderStatuses.forEach((status) => {
                    orderStatuses[status] = (orderStatuses[status] || 0) + 1;
                });
                return {
                    summary: {
                        totalOrders: summary.totalOrders,
                        totalRevenue: summary.totalRevenue,
                        averageOrderValue: summary.averageOrderValue,
                        paymentMethods,
                        orderStatuses
                    },
                    topProducts,
                    recentOrders: recentOrders.map(order => {
                        var _a, _b, _c;
                        return ({
                            transactionId: (_a = order.transactionId) !== null && _a !== void 0 ? _a : 'N/A',
                            customerName: (_c = (_b = order.customer) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : 'Unknown Customer',
                            totalAmount: Number(order.total) || 0,
                            status: order.status,
                            date: order.createdAt
                        });
                    })
                };
            }
            catch (error) {
                throw new Error(`Failed to generate sales report: ${error.message}`);
            }
        });
    }
}
exports.ReportService = ReportService;
