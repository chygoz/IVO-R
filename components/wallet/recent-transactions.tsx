"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallet } from "@/hooks/use-wallet";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface RecentTransactionsProps {
  limit?: number;
}

const RecentTransactions = ({ limit = 5 }: RecentTransactionsProps) => {
  const { transactions, activeWalletCurrency } = useWallet();

  // Filter transactions by the active currency
  const filteredTransactions = transactions
    .filter((tx) => tx.currency === activeWalletCurrency)
    .slice(0, limit);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const getTransactionIcon = (type: string) => {
    return type === "credit" ? (
      <ArrowDownRight className="h-5 w-5 text-green-600 dark:text-green-400" />
    ) : (
      <ArrowUpRight className="h-5 w-5 text-red-600 dark:text-red-400" />
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800"
          >
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
          >
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800"
          >
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activity</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length > 0 ? (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  variants={itemVariants}
                  className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/60 p-2 rounded-md -mx-2 transition-colors"
                >
                  <Link
                    href={`/dashboard/wallet/transactions/${transaction.transactionId}`}
                    className="flex items-center gap-3 flex-1"
                  >
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        transaction.transactionType === "credit"
                          ? "bg-green-100 dark:bg-green-900/20"
                          : "bg-red-100 dark:bg-red-900/20"
                      }`}
                    >
                      {getTransactionIcon(transaction.transactionType)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {transaction.transactionType === "credit"
                          ? `From ${transaction.metadata?.sender || "Unknown"}`
                          : `To ${transaction.destination || "Unknown"}`}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                          {format(
                            new Date(transaction.createdAt),
                            "MMM d, yyyy • h:mm a"
                          )}
                        </p>
                        <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  </Link>
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        transaction.transactionType === "credit"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transaction.transactionType === "credit" ? "+" : "-"}
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Ref: {transaction.referenceId.substring(0, 8)}...
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                <ChevronRight className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No transactions yet</h3>
              <p className="text-sm text-muted-foreground max-w-md mb-1">
                Your recent transactions will appear here
              </p>
            </div>
          )}
        </CardContent>

        {filteredTransactions.length > 0 && (
          <CardFooter className="pt-0">
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/dashboard/wallet/transactions">
                View All Transactions
              </Link>
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default RecentTransactions;
