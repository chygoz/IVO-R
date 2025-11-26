import { TimeRange } from "@/components/dashboard/types";
import { AnalyticsData } from "@/components/analytics/types";

export async function fetchAnalyticsData(
  timeRange: TimeRange
): Promise<AnalyticsData> {
  // In a real app, this would be an actual API call
  // Simulate a network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Adjust the data based on the selected time range
  const multiplier =
    timeRange === "all"
      ? 1
      : timeRange === "12m"
      ? 0.95
      : timeRange === "30d"
      ? 0.7
      : timeRange === "7d"
      ? 0.5
      : 0.25; // 24h

  return {
    totalSales: {
      value: `₦ ${Math.round(12.3 * multiplier * 10) / 10}K`,
      data: [
        { month: "Jan", sales: Math.round(85 * multiplier) },
        { month: "Feb", sales: Math.round(65 * multiplier) },
        { month: "Mar", sales: Math.round(75 * multiplier) },
        { month: "Apr", sales: Math.round(55 * multiplier) },
        { month: "May", sales: Math.round(65 * multiplier) },
        { month: "Jun", sales: Math.round(80 * multiplier) },
        { month: "Jul", sales: Math.round(25 * multiplier) },
        { month: "Aug", sales: Math.round(60 * multiplier) },
        { month: "Sep", sales: Math.round(95 * multiplier) },
        { month: "Oct", sales: Math.round(50 * multiplier) },
        { month: "Nov", sales: Math.round(40 * multiplier) },
        { month: "Dec", sales: Math.round(55 * multiplier) },
      ],
    },
    totalOrders: {
      value: `${Math.round(60.3 * multiplier * 10) / 10}K`,
      data: [
        { month: "Jan", orders: Math.round(40 * multiplier) },
        { month: "Feb", orders: Math.round(50 * multiplier) },
        { month: "Mar", orders: Math.round(45 * multiplier) },
        { month: "Apr", orders: Math.round(60 * multiplier) },
        { month: "May", orders: Math.round(70 * multiplier) },
        { month: "Jun", orders: Math.round(55 * multiplier) },
        { month: "Jul", orders: Math.round(65 * multiplier) },
        { month: "Aug", orders: Math.round(50 * multiplier) },
        { month: "Sep", orders: Math.round(75 * multiplier) },
        { month: "Oct", orders: Math.round(60 * multiplier) },
        { month: "Nov", orders: Math.round(70 * multiplier) },
        { month: "Dec", orders: Math.round(55 * multiplier) },
      ],
    },
    conversionRate: {
      value: `₦ ${Math.round(12.3 * multiplier * 10) / 10}K`,
      visits: 120,
      purchases: 23,
      data: [
        {
          month: "Jan",
          visits: Math.round(70 * multiplier),
          purchases: Math.round(15 * multiplier),
        },
        {
          month: "Feb",
          visits: Math.round(40 * multiplier),
          purchases: Math.round(10 * multiplier),
        },
        {
          month: "Mar",
          visits: Math.round(35 * multiplier),
          purchases: Math.round(8 * multiplier),
        },
        {
          month: "Apr",
          visits: Math.round(70 * multiplier),
          purchases: Math.round(15 * multiplier),
        },
        {
          month: "May",
          visits: Math.round(55 * multiplier),
          purchases: Math.round(12 * multiplier),
        },
        {
          month: "Jun",
          visits: Math.round(40 * multiplier),
          purchases: Math.round(10 * multiplier),
        },
        {
          month: "Jul",
          visits: Math.round(65 * multiplier),
          purchases: Math.round(14 * multiplier),
        },
        {
          month: "Aug",
          visits: Math.round(35 * multiplier),
          purchases: Math.round(8 * multiplier),
        },
        {
          month: "Sep",
          visits: Math.round(55 * multiplier),
          purchases: Math.round(12 * multiplier),
        },
        {
          month: "Oct",
          visits: Math.round(50 * multiplier),
          purchases: Math.round(11 * multiplier),
        },
        {
          month: "Nov",
          visits: Math.round(40 * multiplier),
          purchases: Math.round(10 * multiplier),
        },
        {
          month: "Dec",
          visits: Math.round(75 * multiplier),
          purchases: Math.round(16 * multiplier),
        },
      ],
    },
    categories: [
      { name: "Dresses", percentage: 45 },
      { name: "Pants", percentage: 20 },
      { name: "Blouses & Tops", percentage: 15 },
      { name: "Shirts", percentage: 13 },
      { name: "Co-ord sets", percentage: 7 },
    ],
    topSellingProducts: {
      total: "18K",
      products: [
        { id: 1, name: "Product 1", percentage: 40, color: "#f97316" },
        { id: 2, name: "Product 2", percentage: 24, color: "#10b981" },
        { id: 3, name: "Product 3", percentage: 16, color: "#3b82f6" },
        { id: 4, name: "Product 4", percentage: 20, color: "#ef4444" },
      ],
    },
    salesByLocation: {
      total: "18K",
      locations: [
        { name: "National", percentage: 65, color: "#ef4444" },
        { name: "International", percentage: 35, color: "#10b981" },
      ],
    },
    resellerStores: {
      total: `${Math.round(80.8 * multiplier * 10) / 10}K`,
      data: [
        {
          month: "Jan",
          existingStores: Math.round(80 * multiplier),
          newStores: Math.round(10 * multiplier),
        },
        {
          month: "Feb",
          existingStores: Math.round(60 * multiplier),
          newStores: Math.round(8 * multiplier),
        },
        {
          month: "Mar",
          existingStores: Math.round(75 * multiplier),
          newStores: Math.round(5 * multiplier),
        },
        {
          month: "Apr",
          existingStores: Math.round(45 * multiplier),
          newStores: Math.round(15 * multiplier),
        },
        {
          month: "May",
          existingStores: Math.round(65 * multiplier),
          newStores: Math.round(12 * multiplier),
        },
        {
          month: "Jun",
          existingStores: Math.round(25 * multiplier),
          newStores: Math.round(5 * multiplier),
        },
        {
          month: "Jul",
          existingStores: Math.round(15 * multiplier),
          newStores: Math.round(5 * multiplier),
        },
        {
          month: "Aug",
          existingStores: Math.round(55 * multiplier),
          newStores: Math.round(10 * multiplier),
        },
        {
          month: "Sep",
          existingStores: Math.round(85 * multiplier),
          newStores: Math.round(8 * multiplier),
        },
        {
          month: "Oct",
          existingStores: Math.round(35 * multiplier),
          newStores: Math.round(10 * multiplier),
        },
        {
          month: "Nov",
          existingStores: Math.round(30 * multiplier),
          newStores: Math.round(5 * multiplier),
        },
        {
          month: "Dec",
          existingStores: Math.round(45 * multiplier),
          newStores: Math.round(5 * multiplier),
        },
      ],
    },
    bestResellerStores: [
      { id: 1, name: "Reseller Store 1", revenue: 400000000 },
      { id: 2, name: "Reseller Store 2", revenue: 300000000 },
      { id: 3, name: "Reseller Store 3", revenue: 150000000 },
      { id: 4, name: "Reseller Store 4", revenue: 100000000 },
      { id: 5, name: "Reseller Store 5", revenue: 50000000 },
    ],
  };
}
