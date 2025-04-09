/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import { ReportService } from "../../utils/reports";
import { productModel } from "../product/product.model";
import { BrandModel } from "../brand/brand.model";
import { couponModel } from "../coupon/coupon.model";
import { orderModel } from "../order/order.model";
import { cartModel } from "../cart/cart.model";

const inventoryReport = catchAsync(async (req: Request, res: Response) => {
  const startDate = req.query.startDate
    ? new Date(req.query.startDate as string)
    : undefined;
  const endDate =
    req.query.endDate && typeof req.query.endDate === "string"
      ? new Date(req.query.endDate)
      : undefined;
  const reportService = new ReportService(5); // Low stock threshold = 5

  // Generate inventory report
  const inventoryReport = await reportService.generateInventoryReport({
    startDate,
    endDate,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "inventory report generated successfully",
    data: inventoryReport,
  });
});
const saleReport = catchAsync(async (req: Request, res: Response) => {
  // Validate and parse dates from query parameters
  const startDate = req.query.startDate
    ? new Date(req.query.startDate as string)
    : new Date(new Date().setDate(new Date().getDate() - 30)); // Default to last 30 days

  const endDate = req.query.endDate
    ? new Date(req.query.endDate as string)
    : new Date(); // Default to now
  const reportService = new ReportService(5); // Low stock threshold = 5

  // Generate inventory report
  const salesReport = await reportService.generateSalesReport(
    startDate,
    endDate,
    { topProductsLimit: 5, recentOrdersLimit: 5 }
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Sales report generated successfully",
    data: salesReport,
  });
});

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

const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const { today, yesterday, thisMonthStart, lastMonthStart, lastMonthEnd } =
      getDateRanges();

    // Total counts (keep existing)
    const totalProducts = await productModel.countDocuments({
      isDelete: false,
    });
    const totalBrands = await BrandModel.countDocuments({ isDelete: false });
    await couponModel.countDocuments({
      isActive: true,
      isDelete: false,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

    // Order statistics (keep existing)
    const totalOrders = await orderModel.countDocuments();
    const pendingOrders = await orderModel.countDocuments({
      status: "pending",
    });
    const completedOrders = await orderModel.countDocuments({
      status: "completed",
    });

    // Enhanced financial stats calculation
    const calculateFinancials = async (matchQuery: any) => {
      return await orderModel.aggregate([
        { $match: { ...matchQuery, status: "completed" } },
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
    };

    // Today's stats
    const todayOrders = await orderModel.countDocuments({
      createdAt: { $gte: today },
    });
    const todayFinancials = await calculateFinancials({
      createdAt: { $gte: today },
    });

    // Yesterday's stats
    const yesterdayFinancials = await calculateFinancials({
      createdAt: { $gte: yesterday, $lt: today },
    });

    // Monthly stats
    const thisMonthFinancials = await calculateFinancials({
      createdAt: { $gte: thisMonthStart },
    });
    const lastMonthFinancials = await calculateFinancials({
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
    });

    // Best selling products (keep existing)
    const bestSellers = await productModel
      .find({ isDelete: false })
      .sort({ salesCount: -1 })
      .limit(5)
      .populate("productBrand", "name")
      .populate("productCategory", "name");

    // Recent orders (keep existing)
    const recentOrders = await orderModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("customerId", "name email");

    // Abandoned carts (keep existing)
    const abandonedCarts = await cartModel.countDocuments({
      isCheckout: false,
      updatedAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    // Coupon usage (keep existing)
    const couponUsage = await couponModel.aggregate([
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
          activeCoupons: couponUsage[0]?.activeCoupons || 0,
          totalOrders,
          pendingOrders,
          completedOrders,
          abandonedCarts,
          couponUsage: couponUsage[0]?.totalUsed || 0,
        },
        revenue: {
          today: todayFinancials[0]?.revenue || 0,
          yesterday: yesterdayFinancials[0]?.revenue || 0,
          thisMonth: thisMonthFinancials[0]?.revenue || 0,
          lastMonth: lastMonthFinancials[0]?.revenue || 0,
          todayOrders,
        },
        profit: {
          today: todayFinancials[0]?.profit || 0,
          yesterday: yesterdayFinancials[0]?.profit || 0,
          thisMonth: thisMonthFinancials[0]?.profit || 0,
          lastMonth: lastMonthFinancials[0]?.profit || 0,
        },
        bestSellers,
        recentOrders,
      },
    });
  } catch (error : any) {
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};
export const getSalesReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage: any = { status: "completed" };
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const salesData = await orderModel.aggregate([
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
    const topProducts = await orderModel.aggregate([
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate sales report",
    });
  }
};

export const getInventoryReport = async (req: Request, res: Response) => {
  try {
    // Low stock products (less than 10 in stock)
    const lowStockProducts = await productModel
      .find({
        productStock: { $lt: 10 },
        isDelete: false,
      })
      .sort({ productStock: 1 })
      .limit(20)
      .populate("productBrand", "name")
      .populate("productCategory", "name");

    // Out of stock products
    const outOfStockProducts = await productModel
      .find({
        productStock: 0,
        isDelete: false,
      })
      .populate("productBrand", "name")
      .populate("productCategory", "name");

    // Stock value by category
    const stockValueByCategory = await productModel.aggregate([
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate inventory report",
    });
  }
};

export const getCustomerReport = async (req: Request, res: Response) => {
  try {
    // Top customers by order count and spending
    const topCustomers = await orderModel.aggregate([
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
    const customerAcquisition = await orderModel.aggregate([
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate customer report",
    });
  }
};

export const reportsController = {
  inventoryReport,
  saleReport,
  getDashboardSummary,
};
