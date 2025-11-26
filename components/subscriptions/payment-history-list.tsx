import React, { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Download,
  Receipt,
  CreditCard,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Payment } from "@/types/subscription";

interface PaymentHistoryListProps {
  payments: Payment[];
}

export const PaymentHistoryList: React.FC<PaymentHistoryListProps> = ({
  payments,
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Payment | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const closeInvoiceDialog = () => {
    setSelectedInvoice(null);
  };

  const handleViewInvoice = (payment: Payment) => {
    setSelectedInvoice(payment);
  };

  const handleDownloadInvoice = async (paymentId: string) => {
    setIsDownloading(true);
    try {
      // Simulate API call for invoice download
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`Downloading invoice for payment ${paymentId}`);

      // This would be an actual API call in production
      // const response = await fetch(`/api/invoices/${paymentId}/download`);
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.style.display = 'none';
      // a.href = url;
      // a.download = `invoice-${paymentId}.pdf`;
      // document.body.appendChild(a);
      // a.click();
      // window.URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Paid
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-current mr-1" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  if (payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Payment History</CardTitle>
          <CardDescription>
            View and download your invoice history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Receipt className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
              No payment history
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              You haven&apos;t made any payments yet. When you make a payment,
              you&apos;ll see it here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Payment History</CardTitle>
          <CardDescription>
            View and download your invoice history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment, index) => (
                    <motion.tr
                      key={payment.id || index}
                      variants={itemVariants}
                      className="group hover:bg-gray-50 dark:hover:bg-gray-900/50"
                    >
                      <TableCell className="font-medium">
                        {format(new Date(payment.date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>#{payment.invoiceNumber}</TableCell>
                      <TableCell className="text-right">
                        {payment.amount === 0
                          ? "Free"
                          : `${payment.amount.toLocaleString()} ${
                              payment.currency
                            }`}
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewInvoice(payment)}
                            className="h-8 px-2 text-xs"
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleDownloadInvoice(payment.id || "")
                            }
                            className="h-8 w-8 p-0"
                            disabled={isDownloading}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedInvoice} onOpenChange={closeInvoiceDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Invoice #{selectedInvoice?.invoiceNumber}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="border-b pb-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    IVO Reseller Platform
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    123 Victoria Island
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Lagos, Nigeria
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Invoice #{selectedInvoice?.invoiceNumber}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Date:{" "}
                    {selectedInvoice &&
                      format(new Date(selectedInvoice.date), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                Payment Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Amount
                  </p>
                  <p className="font-medium">
                    {selectedInvoice?.amount === 0
                      ? "Free"
                      : `${selectedInvoice?.amount.toLocaleString()} ${
                          selectedInvoice?.currency
                        }`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Status
                  </p>
                  <p className="font-medium">{selectedInvoice?.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Payment Method
                  </p>
                  <p className="font-medium flex items-center">
                    <CreditCard className="h-4 w-4 mr-1" />
                    {selectedInvoice?.paymentMethod || "Card"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Transaction ID
                  </p>
                  <p className="font-medium">
                    {selectedInvoice?.transactionId || "—"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                Subscription Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Plan
                  </p>
                  <p className="font-medium">
                    {selectedInvoice?.planName || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Period
                  </p>
                  <p className="font-medium">
                    {selectedInvoice?.periodStart && selectedInvoice?.periodEnd
                      ? `${format(
                          new Date(selectedInvoice.periodStart),
                          "MMM d, yyyy"
                        )} - ${format(
                          new Date(selectedInvoice.periodEnd),
                          "MMM d, yyyy"
                        )}`
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() =>
                  selectedInvoice &&
                  handleDownloadInvoice(selectedInvoice.id || "")
                }
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Invoice
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
