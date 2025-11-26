"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Check, X, AlertCircle, CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawModal = ({ isOpen, onClose }: WithdrawModalProps) => {
  const { withdrawalAccounts, activeWalletCurrency, wallets, withdrawFunds } =
    useWallet();
  const { toast } = useToast();

  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [narration, setNarration] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{
    account?: string;
    amount?: string;
  }>({});

  // Get the active wallet
  const activeWallet = wallets.find(
    (wallet) => wallet.currency === activeWalletCurrency
  );

  // Filter accounts by currency
  const filteredAccounts = withdrawalAccounts.filter(
    (account) => account.currency === activeWalletCurrency
  );

  // Reset form on currency change or when modal opens/closes
  useEffect(() => {
    setSelectedAccount("");
    setAmount("");
    setNarration("");
    setErrors({});
  }, [activeWalletCurrency, isOpen]);

  // Handle amount change with validation
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow numbers and decimal point
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);

      if (errors.amount) {
        setErrors((prev) => ({ ...prev, amount: undefined }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: {
      account?: string;
      amount?: string;
    } = {};

    if (!selectedAccount) {
      newErrors.account = "Please select a withdrawal account";
    }

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    } else if (
      activeWallet &&
      parseFloat(amount) > activeWallet.availableBalance
    ) {
      newErrors.amount = "Insufficient balance";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      await withdrawFunds({
        accountId: selectedAccount,
        amount: parseFloat(amount),
        currency: activeWalletCurrency,
        narration: narration || "Withdrawal to bank account",
      });

      toast({
        title: "Withdrawal Initiated",
        description: `Your withdrawal of ${formatCurrency(
          parseFloat(amount),
          activeWalletCurrency
        )} has been initiated and is being processed`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description:
          "We couldn't process your withdrawal at this time. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Transfer funds from your wallet to your bank account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <Tabs value={activeWalletCurrency} className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="NGN">Nigerian Naira (NGN)</TabsTrigger>
              <TabsTrigger value="USD">US Dollar (USD)</TabsTrigger>
            </TabsList>
          </Tabs>

          <div>
            <label
              htmlFor="withdrawal-account"
              className="block text-sm font-medium mb-1"
            >
              Select Account
            </label>
            {filteredAccounts.length > 0 ? (
              <Select
                value={selectedAccount}
                onValueChange={setSelectedAccount}
              >
                <SelectTrigger
                  id="withdrawal-account"
                  className={errors.account ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select a bank account" />
                </SelectTrigger>
                <SelectContent>
                  {filteredAccounts.map((account) => (
                    <SelectItem key={account._id} value={account._id}>
                      {account.bankName} - {account.accountName} (
                      {account.accountNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Alert
                variant="warning"
                className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
              >
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertTitle>No accounts found</AlertTitle>
                <AlertDescription>
                  You need to add a withdrawal account for{" "}
                  {activeWalletCurrency} first
                </AlertDescription>
              </Alert>
            )}
            {errors.account && (
              <p className="text-red-500 text-xs mt-1">{errors.account}</p>
            )}
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-1">
              Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400">
                  {activeWalletCurrency === "USD" ? "$" : "₦"}
                </span>
              </div>
              <Input
                id="amount"
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className={`pl-8 ${errors.amount ? "border-red-500" : ""}`}
                disabled={filteredAccounts.length === 0}
              />
            </div>
            {errors.amount ? (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">
                Available balance:{" "}
                {formatCurrency(
                  activeWallet?.availableBalance || 0,
                  activeWalletCurrency
                )}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="narration"
              className="block text-sm font-medium mb-1"
            >
              Description (Optional)
            </label>
            <Input
              id="narration"
              placeholder="What's this withdrawal for?"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              disabled={filteredAccounts.length === 0}
            />
          </div>

          <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle>Processing Time</AlertTitle>
            <AlertDescription>
              Withdrawals are typically processed within 24 hours during
              business days
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isProcessing || filteredAccounts.length === 0}
          >
            {isProcessing ? (
              <>
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </>
            ) : (
              "Withdraw Funds"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawModal;
