import { CategoryData, SalesData } from "../dashboard/types";

export interface TopSellingProduct {
  id: number;
  name: string;
  percentage: number;
  color: string;
}

export interface SalesByLocation {
  name: string;
  percentage: number;
  color: string;
}

export interface OrderData {
  month: string;
  orders: number;
}

export interface ConversionData {
  month: string;
  visits: number;
  purchases: number;
}

export interface ResellerStoreData {
  month: string;
  existingStores: number;
  newStores: number;
}

export interface BestResellerStore {
  id: number;
  name: string;
  revenue: number;
}

export interface AnalyticsData {
  totalSales: {
    value: string;
    data: SalesData[];
  };
  totalOrders: {
    value: string;
    data: OrderData[];
  };
  conversionRate: {
    value: string;
    visits: number;
    purchases: number;
    data: ConversionData[];
  };
  categories: CategoryData[];
  topSellingProducts: {
    total: string;
    products: TopSellingProduct[];
  };
  salesByLocation: {
    total: string;
    locations: SalesByLocation[];
  };
  resellerStores: {
    total: string;
    data: ResellerStoreData[];
  };
  bestResellerStores: BestResellerStore[];
}
