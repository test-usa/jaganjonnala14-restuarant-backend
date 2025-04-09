/* eslint-disable @typescript-eslint/no-explicit-any */
import { orderModel } from "../modules/order/order.model";
import { productModel } from "../modules/product/product.model";
import { InventoryReport, SalesReport } from "../modules/reports/reports.interface";

export class ReportService {
    private lowStockThreshold: number;
  
    constructor(lowStockThreshold: number = 10) {
      this.lowStockThreshold = lowStockThreshold;
    }
  
    async generateInventoryReport(dateRange?: { startDate?: Date; endDate?: Date }): Promise<InventoryReport> {
        try {
          // Base match query for non-deleted products
          const baseMatch: any = { isDelete: false };
    
          // Add date filter if provided
          if (dateRange?.startDate || dateRange?.endDate) {
            baseMatch.createdAt = {};
            if (dateRange.startDate) baseMatch.createdAt.$gte = new Date(dateRange.startDate);
            if (dateRange.endDate) baseMatch.createdAt.$lte = new Date(dateRange.endDate);
          }
    
          // Get all products with populated category and brand
          const products = await productModel.aggregate([
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
              start: dateRange?.startDate || null,
              end: dateRange?.endDate || null
            }
          };
    
          // Group by category
          const categorySummary = await productModel.aggregate([
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
          const brandSummary = await productModel.aggregate([
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
    
        } catch (error: any) {
          throw new Error(`Failed to generate inventory report: ${error.message}`);
        }
    }
  
   
      async  generateSalesReport(
        startDate: Date,
        endDate: Date,
        options: { topProductsLimit?: number; recentOrdersLimit?: number } = {}
      ): Promise<SalesReport> {
        const {
          topProductsLimit = 10,
          recentOrdersLimit = 10
        } = options;
      
        try {
          // Validate dates
          if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
            throw new Error('Invalid date parameters');
          }
      
          if (startDate > endDate) {
            throw new Error('Start date cannot be after end date');
          }
      
          // Get order summary
          const [orderSummary, topProducts, recentOrders] = await Promise.all([
            // Order summary aggregation
            orderModel.aggregate([
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
            orderModel.aggregate([
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
            orderModel.find({
              createdAt: { $gte: startDate, $lte: endDate }
            })
            .sort({ createdAt: -1 })
            .limit(recentOrdersLimit)
            .lean()
          ]);
      
          // Process payment methods and order statuses
          const paymentMethods: Record<string, number> = {};
          const orderStatuses: Record<string, number> = {};
          
          const summary = orderSummary[0] || {
            totalOrders: 0,
            totalRevenue: 0,
            averageOrderValue: 0,
            paymentMethods: [],
            orderStatuses: []
          };
      
          summary.paymentMethods.forEach((pm: { type: string; method?: string }) => {
            const key = pm.method ? `${pm.type} (${pm.method})` : pm.type;
            paymentMethods[key] = (paymentMethods[key] || 0) + 1;
          });
      
          summary.orderStatuses.forEach((status: string) => {
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
            recentOrders: recentOrders.map(order => ({
              transactionId: order.transactionId ?? 'N/A',
              customerName: order.customer?.name ?? 'Unknown Customer',
              totalAmount: Number(order.total) || 0,
              status: order.status,
              date: order.createdAt
            }))
          };
      
        } catch (error: any) {
          throw new Error(`Failed to generate sales report: ${error.message}`);
        }
      }
  
    // private getDateRange(period: string): { start: Date; end: Date } {
    //   const now = new Date();
    //   const start = new Date();
    //   const end = new Date();
  
    //   switch (period) {
    //     case 'day':
    //       start.setHours(0, 0, 0, 0);
    //       end.setHours(23, 59, 59, 999);
    //       break;
    //     case 'week':
    //       start.setDate(now.getDate() - now.getDay());
    //       start.setHours(0, 0, 0, 0);
    //       end.setDate(start.getDate() + 6);
    //       end.setHours(23, 59, 59, 999);
    //       break;
    //     case 'month':
    //       start.setDate(1);
    //       start.setHours(0, 0, 0, 0);
    //       end.setMonth(start.getMonth() + 1);
    //       end.setDate(0);
    //       end.setHours(23, 59, 59, 999);
    //       break;
    //     case 'year':
    //       start.setMonth(0);
    //       start.setDate(1);
    //       start.setHours(0, 0, 0, 0);
    //       end.setMonth(11);
    //       end.setDate(31);
    //       end.setHours(23, 59, 59, 999);
    //       break;
    //     default:
    //       throw new Error('Invalid time period specified');
    //   }
  
    //   return { start, end };
    // }
  
    // async generateCombinedReport(): Promise<{
    //   inventory: InventoryReport;
    //   sales: SalesReport;
    // }> {
    //   try {
    //     const [inventory, sales] = await Promise.all([
    //       this.generateInventoryReport(),
    //       this.generateSalesReport()
    //     ]);
  
    //     return { inventory, sales };
    //   } catch (error : any) {
    //     throw new Error(`Failed to generate combined report: ${error.message}`);
    //   }
    // }
  }