import { Suspense } from "react";
import TransactionsList from "@/components/wallet/wallet-transaction-list";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Transactions | Wallet",
  description: "View and manage your transaction history.",
};

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">
          View and filter your transaction history
        </p>
      </div>

      <Suspense fallback={<TransactionsListSkeleton />}>
        <TransactionsList />
      </Suspense>
    </div>
  );
}

function TransactionsListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-48" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <Skeleton className="h-10 w-full mb-4" />
        <div className="space-y-3">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-40 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
        </div>
        <div className="flex justify-between items-center mt-4">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    </div>
  );
}
