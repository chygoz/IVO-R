import { Suspense } from "react";
import { TimeFilterContextProvider } from "@/components/dashboard/time-filter-context";
import DashboardHeader from "@/components/analytics/analytics-header";
import TotalSalesSection from "@/components/analytics/total-sales-section";
import CategoriesSection from "@/components/analytics/category-section";
import TopSellingProductSection from "@/components/analytics/top-selling-product-section";
import SalesByLocationSection from "@/components/analytics/sales-by-location-section";
import TotalOrdersSection from "@/components/analytics/total-orders-section";
import LoadingAnalytics from "@/components/analytics/loading";

export default function AnalyticsComponent({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Extract timeRange from searchParams or use default
  const timeRange =
    typeof searchParams.timeRange === "string"
      ? (searchParams.timeRange as "all" | "12m" | "30d" | "7d" | "24h")
      : "all"; // Default to 'all'

  return (
    <TimeFilterContextProvider initialTimeRange={timeRange}>
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />

        <div className="grid grid-cols-1 gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Suspense fallback={<LoadingAnalytics section="sales" />}>
                <TotalSalesSection />
              </Suspense>
            </div>

            <div>
              <Suspense fallback={<LoadingAnalytics section="categories" />}>
                <CategoriesSection />
              </Suspense>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <Suspense fallback={<LoadingAnalytics section="topProducts" />}>
                <TopSellingProductSection />
              </Suspense>
            </div>

            <div className="md:col-span-1">
              <Suspense fallback={<LoadingAnalytics section="location" />}>
                <SalesByLocationSection />
              </Suspense>
            </div>

            <div className="md:col-span-2">
              <Suspense fallback={<LoadingAnalytics section="orders" />}>
                <TotalOrdersSection />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </TimeFilterContextProvider>
  );
}
