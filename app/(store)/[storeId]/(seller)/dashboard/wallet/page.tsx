import { Suspense } from "react";
import WalletOverview from "@/components/wallet/wallet-overview";
import WalletActions from "@/components/wallet/wallet-actions";
import RecentTransactions from "@/components/wallet/recent-transactions";
import WalletBalanceCharts from "@/components/wallet/wallet-balance-charts";
import { Skeleton } from "@/components/ui/skeleton";
import WalletVirtualAccount from "@/components/wallet/wallet-virtual-account";

export const metadata = {
  title: "Wallet | IVO Platform",
  description: "Manage your balance, transactions, and withdrawals.",
};

export default function WalletPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<WalletOverviewSkeleton />}>
        <WalletOverview />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-6">
          <Suspense fallback={<VirtualAccountSkeleton />}>
            <WalletVirtualAccount />
          </Suspense>

          <Suspense fallback={<TransactionsSkeleton />}>
            <RecentTransactions limit={5} />
          </Suspense>
        </div>

        <div className="md:col-span-4 space-y-6">
          <WalletActions />

          <Suspense fallback={<ChartsSkeleton />}>
            <WalletBalanceCharts />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function WalletOverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
        >
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-10 w-40 mb-4" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}

function VirtualAccountSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <Skeleton className="h-6 w-48 mb-4" />
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

function TransactionsSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <Skeleton className="h-6 w-48 mb-4" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartsSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <Skeleton className="h-6 w-32 mb-4" />
      <Skeleton className="h-40 w-full rounded-md" />
    </div>
  );
}
