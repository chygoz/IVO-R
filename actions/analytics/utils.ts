interface TrendData {
    current: number;
    previous: number;
    trend: string;
    trendDirection: 'up' | 'down' | 'stable';
  }
  
  interface SalesData extends TrendData {
    currency: string;
  }
  
  export interface AnalyticsData {
    customers: TrendData;
    orders: TrendData;
    sales: SalesData;
    topProducts: any[]; // define properly if needed
    monthlySales: any[]; // define properly if needed
    categoryBreakdown: any[]; // define properly if needed
    resellers: TrendData;
  }
  
  interface APIResponse {
    success: boolean;
    data: AnalyticsData;
    cached: boolean;
  }
  