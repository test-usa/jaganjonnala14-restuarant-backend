 export interface InventoryReport {
    summary: {
      totalProducts: number;
      outOfStock: number;
      lowStock: number;
      totalStockValue: number;
      totalPotentialRevenue: number;
    };
    categorySummary: Array<{
      name: string;
      type: string;
      productCount: number;
      stockValue: number;
    }>;
    brandSummary: Array<{
      name: string;
      isFeatured: string;
      productCount: number;
      stockValue: number;
    }>;
    productDetails: Array<{
      productName: string;
      skuCode: string;
      category: string;
      brand: string;
      currentStock: number;
      buyingPrice: number;
      sellingPrice: number;
      offerPrice: number;
      stockValue: number;
      status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    }>;
  }
  
 export interface SalesReport {
    summary: {
      totalOrders: number;
      totalRevenue: number;
      averageOrderValue: number;
      paymentMethods: Record<string, number>;
      orderStatuses: Record<string, number>;
    };
    topProducts: Array<{
      productName: string;
      skuCode: string;
      quantitySold: number;
      totalRevenue: number;
    }>;
    recentOrders: Array<{
      transactionId: string;
      customerName: string;
      totalAmount: number;
      status: string;
      date: Date;
    }>;
  }