"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Calendar,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Pagination } from "@/components/ui/pagination";
import { useWallet } from "@/hooks/use-wallet";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const TransactionsList = () => {
  const {
    fetchTransactions,
    transactions,
    activeWalletCurrency,
    setActiveWalletCurrency,
  } = useWallet();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [page, setPage] = useState(1);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Number of items per page
  const limit = 10;

  // Calculate total pages
  const totalPages = Math.ceil(transactions.length / limit);

  // Apply filters and pagination
  const filteredTransactions = transactions
    .filter((tx) => tx.currency === activeWalletCurrency)
    .filter(
      (tx) =>
        searchTerm === "" ||
        tx.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.referenceId.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((tx) => statusFilter === "" || tx.status === statusFilter)
    .filter((tx) => typeFilter === "" || tx.transactionType === typeFilter)
    .filter((tx) => {
      if (!dateRange.from) return true;

      const txDate = new Date(tx.createdAt);

      if (dateRange.to) {
        // Include the end date fully
        const endDate = new Date(dateRange.to);
        endDate.setHours(23, 59, 59, 999);
        return txDate >= dateRange.from && txDate <= endDate;
      }

      return txDate >= dateRange.from;
    });

  // Get transactions for current page
  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * limit,
    page * limit
  );

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  // Handle filter changes
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    setPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setTypeFilter("");
    setDateRange({});
    setPage(1);
  };

  // Handle date selection
  const handleDateSelect = (range: { from?: Date; to?: Date }) => {
    setDateRange(range);
    if (range.to) {
      setIsCalendarOpen(false);
    }
    setPage(1);
  };

  // Format date range for display
  const formatDateRange = () => {
    if (!dateRange.from) return "Select dates";

    const fromStr = format(dateRange.from, "MMM d, yyyy");
    if (!dateRange.to) return `From ${fromStr}`;

    const toStr = format(dateRange.to, "MMM d, yyyy");
    return `${fromStr} - ${toStr}`;
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get transaction icon based on type
  const getTransactionIcon = (type: string) => {
    return type === "credit" ? (
      <ArrowDownRight className="h-5 w-5 text-green-600 dark:text-green-400" />
    ) : (
      <ArrowUpRight className="h-5 w-5 text-red-600 dark:text-red-400" />
    );
  };

  // Get status badge
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

  // Export transactions as CSV
  const exportTransactions = () => {
    if (filteredTransactions.length === 0) return;

    const headers = [
      "Transaction ID",
      "Reference",
      "Type",
      "Amount",
      "Status",
      "Date",
      "Destination",
    ];
    const rows = filteredTransactions.map((tx) => [
      tx.transactionId,
      tx.referenceId,
      tx.transactionType,
      tx.amount,
      tx.status,
      new Date(tx.createdAt).toISOString(),
      tx.destination || "Unknown",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `transactions_${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0 },
  };

  // Fetch transactions on mount and when currency changes
  useEffect(() => {
    setIsLoading(true);
    fetchTransactions().finally(() => setIsLoading(false));
  }, [fetchTransactions, activeWalletCurrency]);

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <CardTitle className="text-xl">Transaction History</CardTitle>

            <div className="flex items-center gap-2">
              <Select
                value={activeWalletCurrency}
                onValueChange={setActiveWalletCurrency}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">NGN</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={exportTransactions}
                disabled={filteredTransactions.length === 0}
              >
                <Download size={14} />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by transaction or reference ID"
                className="w-full pl-9"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className="flex flex-1 flex-wrap gap-3">
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full md:w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-full md:w-[130px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                  <SelectItem value="debit">Debit</SelectItem>
                </SelectContent>
              </Select>

              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full md:w-[220px] justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {formatDateRange()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    //@ts-expect-error
                    selected={dateRange}
                    //@ts-expect-error
                    onSelect={handleDateSelect}
                    numberOfMonths={1}
                  />
                </PopoverContent>
              </Popover>

              {(searchTerm || statusFilter || typeFilter || dateRange.from) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-10"
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : paginatedTransactions.length > 0 ? (
              <div className="space-y-1">
                {paginatedTransactions.map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    layoutId={transaction.id.toString()}
                    className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/60 p-3 rounded-md -mx-2 transition-colors"
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
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">
                          {transaction.transactionType === "credit"
                            ? `From ${
                                transaction.metadata?.sender || "Unknown"
                              }`
                            : `To ${transaction.destination || "Unknown"}`}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs text-muted-foreground truncate">
                            {format(
                              new Date(transaction.createdAt),
                              "MMM d, yyyy • h:mm a"
                            )}
                          </p>
                          <div className="h-1 w-1 rounded-full bg-muted-foreground hidden sm:block" />
                          <p className="text-xs text-muted-foreground truncate hidden sm:block">
                            ID: {transaction.transactionId.substring(0, 8)}...
                          </p>
                          <div className="h-1 w-1 rounded-full bg-muted-foreground hidden sm:block" />
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
                        {formatCurrency(
                          transaction.amount,
                          transaction.currency
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Ref: {transaction.referenceId.substring(0, 6)}...
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <Filter className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">
                  No transactions found
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {searchTerm || statusFilter || typeFilter || dateRange.from
                    ? "Try adjusting your filters to see more results"
                    : "Your transaction history will appear here once you have transactions"}
                </p>
                {(searchTerm ||
                  statusFilter ||
                  typeFilter ||
                  dateRange.from) && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={clearFilters}
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            )}
          </AnimatePresence>
        </CardContent>

        {paginatedTransactions.length > 0 && totalPages > 1 && (
          <CardFooter className="flex justify-between items-center py-4">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(page * limit, filteredTransactions.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium">{filteredTransactions.length}</span>{" "}
              results
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default TransactionsList;
