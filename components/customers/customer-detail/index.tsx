"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCustomerById, getCustomerTransactions } from "@/actions/customer";
import { Customer, CustomerTransaction } from "@/types/customer";
import { Button } from "@/components/ui/button";

import {
  ArrowLeft,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ClipboardIcon,
  HomeIcon,
  MailIcon,
  PhoneIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, getInitials } from "@/lib/utils";
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
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

interface CustomerDetailProps {
  customerId: string;
}

export function CustomerDetail({ customerId }: CustomerDetailProps) {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<CustomerTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [transactionPage, setTransactionPage] = useState(1);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    fetchCustomerDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  useEffect(() => {
    if (customer) {
      fetchTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer, transactionPage, dateRange, statusFilter]);

  const fetchCustomerDetails = async () => {
    setLoading(true);
    try {
      const response = await getCustomerById(customerId);
      if (response.success && response.data) {
        setCustomer(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch customer details");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setTransactionsLoading(true);
    try {
      const formattedDateRange =
        dateRange.from && dateRange.to
          ? {
              from: format(dateRange.from, "yyyy-MM-dd"),
              to: format(dateRange.to, "yyyy-MM-dd"),
            }
          : undefined;

      const response = await getCustomerTransactions(
        customerId,
        transactionPage,
        10,
        formattedDateRange,
        statusFilter
      );

      if (response.success && response.data) {
        setTransactions(response.data);
        setTotalTransactions(response.count || 0);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch transactions");
    } finally {
      setTransactionsLoading(false);
    }
  };

  const handleBackToList = () => {
    const base = `/${(typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "").trim()}`;
    router.push(`${base}/dashboard/management/customers`);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handlePageChange = (newPage: number) => {
    setTransactionPage(newPage);
  };

  const handleDateSelect = (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => {
    setDateRange(range);
    setTransactionPage(1); // Reset to first page when filter changes
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value === "all" ? undefined : value);
    setTransactionPage(1); // Reset to first page when filter changes
  };

  const transactionPages = Math.ceil(totalTransactions / 10);

  if (loading) {
    return (
      <div className="flex justify-center p-8">Loading customer details...</div>
    );
  }

  if (!customer) {
    return <div className="flex justify-center p-8">Customer not found</div>;
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Button
            variant="link"
            className="p-0 h-auto text-muted-foreground"
            onClick={() => {
              const base = `/${(typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "").trim()}`;
              router.push(`${base}/dashboard`);
            }}
          >
            Dashboard
          </Button>
          <span>/</span>
          <Button
            variant="link"
            className="p-0 h-auto text-muted-foreground"
            onClick={handleBackToList}
          >
            Customer List
          </Button>
          <span>/</span>
          <span>Customer Details</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Info Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-800 text-xl">
                  {getInitials(` ${customer.firstName} ${customer.lastName}`)}
                </div>
                <div>
                  <h2 className="text-xl font-bold capitalize">
                    {customer.firstName} {customer.lastName}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {customer.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-8">
              <h3 className="text-lg font-semibold">Customer Info.</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">
                      <PhoneIcon size={16} />
                    </span>
                    <span>Customer</span>
                  </div>
                  <div className="flex items-center space-x-1 capitalize">
                    <span>
                      {customer.firstName} {customer.lastName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">
                      <MailIcon size={16} />
                    </span>
                    <span>Email</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="max-w-[180px] truncate">
                      {customer.email}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCopyText(customer.email)}
                    >
                      <ClipboardIcon size={14} />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">
                      <PhoneIcon size={16} />
                    </span>
                    <span>Phone Number</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{customer.phone || "—"}</span>
                    {customer.phone && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleCopyText(customer.phone || "")}
                      >
                        <ClipboardIcon size={14} />
                      </Button>
                    )}
                  </div>
                </div>

                {customer.address && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">
                        <HomeIcon size={16} />
                      </span>
                      <span>Address</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm text-right">
                        {customer.address.formattedAddress}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {customer.billingAddress && (
              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-semibold">Billing Address</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">
                        <HomeIcon size={16} />
                      </span>
                      <span>Address</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm text-right">
                        {customer.billingAddress.formattedAddress}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {customer.performance && (
              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-semibold">Customer Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-3xl font-bold">
                      {/**@ts-expect-error */}
                      {formatCurrency(customer.performance.totalSpending)}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Total Spending
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-3xl font-bold">
                      {customer.performance.totalOrders}
                    </h4>
                    <p className="text-sm text-muted-foreground">Total Order</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-3xl font-bold">
                      {customer.performance.completedOrders}
                    </h4>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-3xl font-bold">
                      {customer.performance.canceledOrders}
                    </h4>
                    <p className="text-sm text-muted-foreground">Canceled</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Transaction History Column */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-xl font-bold mb-4 md:mb-0">
                Transaction History
              </h2>
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <div className="flex-1 md:flex-none">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange.from &&
                            !dateRange.to &&
                            "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                              {format(dateRange.to, "MMM dd, yyyy")}
                            </>
                          ) : (
                            format(dateRange.from, "MMM dd, yyyy")
                          )
                        ) : (
                          "Select Dates"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={dateRange}
                        /**@ts-expect-error */
                        onSelect={handleDateSelect}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Select
                  onValueChange={handleStatusFilterChange}
                  defaultValue="all"
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionsLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell className="font-medium">
                        {transaction._id}
                      </TableCell>
                      <TableCell>
                        {dayjs(transaction.createdAt).format("YYYY/MM/DD")}
                      </TableCell>
                      <TableCell>
                        <div
                          className={cn(
                            "flex items-center space-x-1 capitalize",
                            transaction.status === "completed"
                              ? "text-green-500"
                              : transaction.status === "pending"
                              ? "text-amber-500"
                              : "text-red-500"
                          )}
                        >
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full",
                              transaction.status === "completed"
                                ? "bg-green-500"
                                : transaction.status === "pending"
                                ? "bg-amber-500"
                                : "bg-red-500"
                            )}
                          />
                          <span>{transaction.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {/**@ts-expect-error */}
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {transactions.length > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(transactionPage - 1)}
                  disabled={transactionPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center text-sm">
                  <span>Page</span>
                  <span className="font-medium mx-2">{transactionPage}</span>
                  <span>of {transactionPages || 1}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(transactionPage + 1)}
                  disabled={transactionPage >= transactionPages}
                >
                  Next Page
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="outline"
          onClick={handleBackToList}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>
      </div>
    </div>
  );
}
