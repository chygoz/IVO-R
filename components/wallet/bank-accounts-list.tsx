"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/components/ui/use-toast";

interface BankAccountsListProps {
  onAddNew?: () => void;
}

const BankAccountsList = ({ onAddNew }: BankAccountsListProps) => {
  const { withdrawalAccounts, initiateAccountDelete, confirmAccountDelete } =
    useWallet();
  const { toast } = useToast();

  const [selectedCurrency, setSelectedCurrency] = useState<string>("all");
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [isInitiating, setIsInitiating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const [otpError, setOtpError] = useState<string | null>(null);
  console.log(withdrawalAccounts, "accts")
  // Filter accounts by currency
  const filteredAccounts =
    selectedCurrency === "all"
      ? withdrawalAccounts
      : withdrawalAccounts.filter(
        (account) => account.currency === selectedCurrency
      );

  const handleDeleteClick = async (accountId: string) => {
    setIsInitiating(true);
    try {
      const reqId = await initiateAccountDelete(accountId);
      setAccountToDelete(accountId);
      setRequestId(reqId);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to initiate account deletion",
        variant: "destructive",
      });
    } finally {
      setIsInitiating(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setOtp(value);

      if (otpError) {
        setOtpError(null);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!accountToDelete || !requestId) return;

    if (!otp || otp.length < 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    setOtpError(null);

    try {
      await confirmAccountDelete(accountToDelete, requestId, otp);

      setAccountToDelete(null);
      setRequestId(null);
      setOtp("");
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid OTP or request expired. Please try again.",
        variant: "destructive",
      });
      setOtpError("Invalid OTP. Please check and try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-4">
        <Tabs
          value={selectedCurrency}
          onValueChange={setSelectedCurrency}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="NGN">NGN</TabsTrigger>
            <TabsTrigger value="USD">USD</TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredAccounts.length > 0 ? (
          <div className="space-y-3">
            {filteredAccounts.map((account) => (
              <Card
                key={account._id}
                className="p-4 flex flex-col sm:flex-row justify-between gap-4 bg-white dark:bg-gray-800"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{account.bankName}</h3>
                    <Badge variant="outline">{account.currency}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {account.accountName} • {account.accountNumber}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="whitespace-nowrap"
                  onClick={() => handleDeleteClick(account._id)}
                  disabled={isInitiating}
                >
                  {isInitiating ? (
                    <>
                      <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </>
                  )}
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">No accounts found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedCurrency === "all"
                ? "You haven't added any withdrawal accounts yet"
                : `You haven\'t added any ${selectedCurrency} withdrawal accounts yet`}
            </p>
            <Button onClick={onAddNew}>Add Withdrawal Account</Button>
          </div>
        )}
      </div>

      <AlertDialog
        open={!!accountToDelete && !!requestId}
        onOpenChange={(open) => {
          if (!open) {
            setAccountToDelete(null);
            setRequestId(null);
            setOtp("");
            setOtpError(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Withdrawal Account</AlertDialogTitle>
            <AlertDialogDescription>
              We&apos;ve sent a 6-digit verification code to your registered email address. Please enter it below to confirm the deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <label htmlFor="otp" className="block text-sm font-medium mb-2">
              Enter OTP
            </label>
            <Input
              id="otp"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className={otpError ? "border-red-500" : ""}
            />
            {otpError && (
              <p className="text-red-500 text-xs mt-1">{otpError}</p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isVerifying}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              disabled={isVerifying}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              {isVerifying ? (
                <>
                  <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Verifying...
                </>
              ) : (
                "Confirm Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BankAccountsList;
