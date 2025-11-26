"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  CheckCheck,
  Download,
  ReceiptText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";

interface TransactionDetailProps {
  id: string;
}

const TransactionDetail = ({ id }: TransactionDetailProps) => {
  const { getTransactionById } = useWallet();
  const { toast } = useToast();
  const [transaction, setTransaction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      setIsLoading(true);
      try {
        const data = await getTransactionById(id);
        setTransaction(data);
      } catch (error) {
        console.error("Error fetching transaction:", error);
        toast({
          title: "Error",
          description: "Failed to load transaction details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransaction();
  }, [id, getTransactionById, toast]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);

      toast({
        title: "Copied!",
        description: `${field} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <ReceiptText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-1">Transaction not found</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-4">
          The transaction you&apos;re looking for doesn&apos;t exist or you may
          not have permission to view it
        </p>
        <Button asChild>
          <a href="/dashboard/wallet/transactions">Back to Transactions</a>
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    transaction.transactionType === "credit"
                      ? "bg-green-100 dark:bg-green-900/20"
                      : "bg-red-100 dark:bg-red-900/20"
                  }`}
                >
                  {transaction.transactionType === "credit" ? (
                    <ArrowDownRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <CardTitle>
                  {transaction.transactionType === "credit"
                    ? "Wallet Credit"
                    : "Wallet Debit"}
                </CardTitle>
              </div>
              <CardDescription>
                {format(
                  new Date(transaction.createdAt),
                  "EEEE, MMMM d, yyyy • h:mm a"
                )}
              </CardDescription>
            </div>
            {getStatusBadge(transaction.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center my-4">
            <h2
              className={`text-3xl font-bold ${
                transaction.transactionType === "credit"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {transaction.transactionType === "credit" ? "+" : "-"}
              {formatCurrency(transaction.amount, transaction.currency)}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Transaction ID
                </p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{transaction.transactionId}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() =>
                      copyToClipboard(
                        transaction.transactionId,
                        "Transaction ID"
                      )
                    }
                  >
                    {copiedField === "Transaction ID" ? (
                      <CheckCheck size={14} className="text-green-500" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Reference ID
                </p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{transaction.referenceId}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() =>
                      copyToClipboard(transaction.referenceId, "Reference ID")
                    }
                  >
                    {copiedField === "Reference ID" ? (
                      <CheckCheck size={14} className="text-green-500" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Type</p>
                <p className="font-medium capitalize">
                  {transaction.transactionType}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <p className="font-medium capitalize">{transaction.status}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {transaction.transactionType === "credit" ? "From" : "To"}
                </p>
                <p className="font-medium">
                  {transaction.transactionType === "credit"
                    ? transaction.metadata?.sender || "Unknown"
                    : transaction.destination || "Unknown"}
                </p>
              </div>

              {Object.keys(transaction.metadata || {})
                .filter((key) => key !== "sender" && key !== "reference")
                .map((key) => (
                  <div key={key}>
                    <p className="text-sm text-muted-foreground mb-1 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="font-medium">
                      {typeof transaction.metadata[key] === "object"
                        ? JSON.stringify(transaction.metadata[key])
                        : transaction.metadata[key]}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {transaction.ledgerEntries && transaction.ledgerEntries.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Ledger Entries</CardTitle>
            <CardDescription>
              Record of transactions affecting your balance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transaction.ledgerEntries.map((entry: any, index: number) => (
                <div
                  key={entry.id || index}
                  className="flex justify-between items-center p-3 border border-gray-100 dark:border-gray-700 rounded-md"
                >
                  <div>
                    <p className="font-medium">
                      {entry.entryType === "credit" ? "Credit" : "Debit"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(entry.createdAt),
                        "MMM d, yyyy • h:mm a"
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        entry.entryType === "credit"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {entry.entryType === "credit" ? "+" : "-"}
                      {formatCurrency(entry.amount, transaction.currency)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Balance:{" "}
                      {formatCurrency(entry.balance, transaction.currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() =>
            toast({
              title: "Receipt Downloaded",
              description:
                "Transaction receipt has been downloaded successfully",
            })
          }
        >
          <Download size={16} />
          Download Receipt
        </Button>
      </div>
    </motion.div>
  );
};

export default TransactionDetail;
