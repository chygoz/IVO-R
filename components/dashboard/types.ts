// types/dashboard.ts
export type TimeRange = "all" | "12m" | "30d" | "7d" | "24h";

export interface SummaryCard {
  title: string;
  value: string | number;
  subValue?: string;
  increment: number;
  icon: string;
}

export interface CategoryData {
  name: string;
  percentage: number;
}

export interface SalesData {
  month: string;
  sales: number;
  reseller?: number;
}

export interface OrderStatus {
  processing: number;
  delivered: number;
  cancelled: number;
  shipped: number;
}

export interface Order {
  id: string;
  productName: string;
  productCount: number;
  date: string;
  customer: {
    name: string;
    email: string;
  };
  total: number;
  status: "processing" | "delivered" | "cancelled" | "shipped";
}

export interface DashboardData {
  summaryCards: {
    totalSales: SummaryCard;
    totalOrders: SummaryCard;
    totalCustomers: SummaryCard;
    totalResellers: SummaryCard;
  };
  salesData: SalesData[];
  categories: CategoryData[];
  recentOrders: Order[];
  orderStatus: OrderStatus;
}
