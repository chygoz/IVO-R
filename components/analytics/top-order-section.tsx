"use client";
import { use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAnalyticsData } from "@/lib/api-analytics";
import { useTimeFilter } from "../dashboard/time-filter-context";
import OrdersLineChart from "./orders-line-chart";

export default function TotalOrdersSection() {
  const { timeRange } = useTimeFilter();
  const data = use(fetchAnalyticsData(timeRange));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Total Order</CardTitle>
        <div className="text-2xl font-bold">{data.totalOrders.value}</div>
      </CardHeader>
      <CardContent>
        <OrdersLineChart data={data.totalOrders.data} />
      </CardContent>
    </Card>
  );
}
