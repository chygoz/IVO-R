"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/hooks/use-wallet";
import { formatCurrency } from "@/lib/utils";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  LabelList,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useState } from "react";

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label, currency }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm text-xs">
        <p className="font-medium">{label}</p>
        <p className="text-green-600 dark:text-green-400">
          Credit: {formatCurrency(payload[0].value, currency)}
        </p>
        <p className="text-red-600 dark:text-red-400">
          Debit: {formatCurrency(payload[1].value, currency)}
        </p>
      </div>
    );
  }

  return null;
};

const WalletBalanceCharts = () => {
  const { transactionStats, activeWalletCurrency } = useWallet();
  const [chartView, setChartView] = useState<"flow" | "summary">("flow");

  // Calculate total for the pie chart
  const total = useMemo(() => {
    if (!transactionStats.chartData) return 0;
    return transactionStats.chartData.reduce(
      (acc, curr) => acc + curr.credit + curr.debit,
      0
    );
  }, [transactionStats.chartData]);

  // Prepare pie chart data
  const pieData = useMemo(() => {
    return [
      { name: "Credit", value: transactionStats.stats.creditAmount },
      { name: "Debit", value: transactionStats.stats.debitAmount },
    ];
  }, [transactionStats.stats]);

  // Colors for the pie chart
  const COLORS = ["#4ade80", "#f87171"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Transaction Trends</CardTitle>
            <Tabs
              value={chartView}
              onValueChange={(value) =>
                setChartView(value as "flow" | "summary")
              }
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-[160px]">
                <TabsTrigger value="flow" className="text-xs px-2">
                  Flow
                </TabsTrigger>
                <TabsTrigger value="summary" className="text-xs px-2">
                  Summary
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {chartView === "flow" ? (
            <div className="h-48">
              {transactionStats.chartData &&
              transactionStats.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={transactionStats.chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorCredit"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#4ade80"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#4ade80"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorDebit"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#f87171"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#f87171"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                      }}
                    />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) =>
                        formatCurrency(value, activeWalletCurrency, false)
                      }
                      width={40}
                    />
                    <Tooltip
                      content={
                        <CustomTooltip currency={activeWalletCurrency} />
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="credit"
                      stackId="1"
                      stroke="#4ade80"
                      fillOpacity={1}
                      fill="url(#colorCredit)"
                    />
                    <Area
                      type="monotone"
                      dataKey="debit"
                      stackId="2"
                      stroke="#f87171"
                      fillOpacity={1}
                      fill="url(#colorDebit)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    No transaction data to display
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(value as number, activeWalletCurrency),
                      "",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-1 text-center">
              <p className="text-xs text-muted-foreground">Total Credits</p>
              <p className="font-medium text-green-600 dark:text-green-400">
                {formatCurrency(
                  transactionStats.stats.creditAmount,
                  activeWalletCurrency
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {transactionStats.stats.creditCount} transactions
              </p>
            </div>
            <div className="space-y-1 text-center">
              <p className="text-xs text-muted-foreground">Total Debits</p>
              <p className="font-medium text-red-600 dark:text-red-400">
                {formatCurrency(
                  transactionStats.stats.debitAmount,
                  activeWalletCurrency
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {transactionStats.stats.debitCount} transactions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WalletBalanceCharts;
