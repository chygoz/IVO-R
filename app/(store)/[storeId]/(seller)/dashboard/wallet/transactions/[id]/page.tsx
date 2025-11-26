import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import TransactionDetail from "@/components/wallet/transaction-detail";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Transaction Details | Wallet",
  description: "View details of a specific transaction.",
};

interface TransactionDetailPageProps {
  params: {
    storeId: string;
    id: string;
  };
}

export default function TransactionDetailPage({
  params,
}: TransactionDetailPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${params.storeId}/dashboard/wallet/transactions`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Transaction Details
          </h1>
          <p className="text-muted-foreground">Transaction ID: {params.id}</p>
        </div>
      </div>

      <Suspense fallback={<TransactionDetailSkeleton />}>
        <TransactionDetail id={params.id} />
      </Suspense>
    </div>
  );
}

function TransactionDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-6 w-48" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-6 w-40" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-6 w-36" />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-6 w-48" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-6 w-40" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex justify-between items-center p-3 border border-gray-100 dark:border-gray-700 rounded-md"
            >
              <div>
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
