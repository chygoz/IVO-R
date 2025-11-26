"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SearchableSelect from "@/components/ui/select-with-search";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/components/ui/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import BankAccountsList from "../bank-accounts-list";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddAccountModal = ({ isOpen, onClose }: AddAccountModalProps) => {
  const { initiateAccountAdd, confirmAccountAdd, banks } = useWallet();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<string>("add");
  const [currency, setCurrency] = useState<string>("NGN");
  const [bankId, setBankId] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [sortCode, setSortCode] = useState<string>("");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [otp, setOtp] = useState<string>("");
  const [isInitiating, setIsInitiating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    bankId?: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    sortCode?: string;
  }>({});

  // Reset form on tab change
  useEffect(() => {
    resetForm();
  }, [activeTab, currency]);

  const resetForm = () => {
    setBankId("");
    setBankName("");
    setAccountNumber("");
    setAccountName("");
    setSortCode("");
    setRequestId(null);
    setOtp("");
    setOtpError(null);
    setErrors({});
  };

  // Auto-fill bank name when bank is selected from list
  useEffect(() => {
    if (bankId) {
      const selected = banks.find((bank) => bank.id === bankId);
      if (selected) {
        setBankName(selected.name);
      }
    }
  }, [bankId, banks]);

  // Handle account number input
  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setAccountNumber(value);

      if (errors.accountNumber) {
        setErrors((prev) => ({ ...prev, accountNumber: undefined }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: {
      bankId?: string;
      bankName?: string;
      accountNumber?: string;
      accountName?: string;
      sortCode?: string;
    } = {};

    if (currency === "NGN") {
      if (!bankId) {
        newErrors.bankId = "Please select a bank";
      }

      if (!accountNumber || accountNumber.length < 10) {
        newErrors.accountNumber = "Please enter a valid account number";
      }
    } else {
      if (!bankName) {
        newErrors.bankName = "Please enter bank name";
      }

      if (!sortCode) {
        newErrors.sortCode = "Please enter routing/sort code";
      }

      if (!accountNumber) {
        newErrors.accountNumber = "Please enter account number";
      }
    }

    if (!accountName) {
      newErrors.accountName = "Please enter account name";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInitiateAdd = async () => {
    if (!validateForm()) return;

    setIsInitiating(true);

    try {
      const reqId = await initiateAccountAdd({
        accountName,
        accountNumber,
        bankName: currency === "NGN" ? bankName : bankName,
        bankId: currency === "NGN" ? bankId : undefined,
        sortCode: currency === "NGN" ? sortCode : sortCode,
        currency,
      });

      setRequestId(reqId);
    } catch (error) {
    } finally {
      setIsInitiating(false);
    }
  };

  const handleConfirmAdd = async () => {
    if (!requestId || !otp || otp.length < 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    setOtpError(null);

    try {
      await confirmAccountAdd(requestId, otp);

      resetForm();
      setActiveTab("manage");
    } catch (error) {
      setOtpError("Invalid OTP. Please check and try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (otpError) setOtpError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Withdrawal Accounts</DialogTitle>
          <DialogDescription>
            Manage bank accounts for withdrawing funds
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="manage">Manage Accounts</TabsTrigger>
            <TabsTrigger value="add">Add New Account</TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="mt-4 space-y-4">
            <BankAccountsList onAddNew={() => setActiveTab("add")} />
          </TabsContent>

          <TabsContent value="add" className="mt-4 space-y-6">
            {!requestId ? (
              <>
                <Tabs
                  value={currency}
                  onValueChange={setCurrency}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="NGN">Nigerian Naira (NGN)</TabsTrigger>
                    <TabsTrigger value="USD">US Dollar (USD)</TabsTrigger>
                  </TabsList>
                </Tabs>

                {currency === "NGN" ? (
                  <div>
                    <label
                      htmlFor="bank"
                      className="block text-sm font-medium mb-1"
                    >
                      Bank
                    </label>
                    <SearchableSelect
                      value={bankId}
                      onChange={setBankId}
                      className={errors.bankId ? "border-red-500" : ""}
                      placeholder="Select bank"
                      items={banks.map((bank) => ({
                        label: bank.name,
                        value: bank.id,
                      }))}
                    />
                    {errors.bankId && (
                      <p className="text-red-500 text-xs mt-1">{errors.bankId}</p>
                    )}
                  </div>
                ) : (
                  <>
                    <div>
                      <label
                        htmlFor="bank-name"
                        className="block text-sm font-medium mb-1"
                      >
                        Bank Name
                      </label>
                      <Input
                        id="bank-name"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="Enter bank name"
                        className={errors.bankName ? "border-red-500" : ""}
                      />
                      {errors.bankName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.bankName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="sort-code"
                        className="block text-sm font-medium mb-1"
                      >
                        Routing/Sort Code
                      </label>
                      <Input
                        id="sort-code"
                        value={sortCode}
                        onChange={(e) => setSortCode(e.target.value)}
                        placeholder="Enter routing or sort code"
                        className={errors.sortCode ? "border-red-500" : ""}
                      />
                      {errors.sortCode && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.sortCode}
                        </p>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label
                    htmlFor="account-number"
                    className="block text-sm font-medium mb-1"
                  >
                    Account Number
                  </label>
                  <Input
                    id="account-number"
                    value={accountNumber}
                    onChange={handleAccountNumberChange}
                    placeholder="Enter account number"
                    maxLength={currency === "NGN" ? 10 : 20}
                    className={errors.accountNumber ? "border-red-500" : ""}
                  />
                  {errors.accountNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.accountNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="account-name"
                    className="block text-sm font-medium mb-1"
                  >
                    Account Name
                  </label>
                  <Input
                    id="account-name"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Enter account name"
                    className={errors.accountName ? "border-red-500" : ""}
                  />
                  {errors.accountName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.accountName}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleInitiateAdd}
                  disabled={isInitiating}
                  className="w-full mt-4"
                >
                  {isInitiating ? (
                    <>
                      <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-lg mb-2">Verify OTP</h3>
                  <p className="text-muted-foreground text-sm">
                    We&apos;ve sent a 6-digit verification code to your registered email address.
                  </p>
                </div>

                <div className="flex flex-col items-center space-y-4">
                  <InputOTP value={otp} onChange={handleOtpChange} maxLength={6}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>

                  {otpError && (
                    <p className="text-red-500 text-sm">{otpError}</p>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => setRequestId(null)}
                    variant="outline"
                    className="flex-1"
                    disabled={isVerifying}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleConfirmAdd}
                    disabled={isVerifying}
                    className="flex-1"
                  >
                    {isVerifying ? (
                      <>
                        <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Verifying...
                      </>
                    ) : (
                      "Add Account"
                    )}
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 sm:gap-0 flex-row">
          {activeTab === "manage" && (
            <Button
              variant="default"
              onClick={() => setActiveTab("add")}
              className="sm:mr-auto"
            >
              Add New Account
            </Button>
          )}
          <Button variant="outline" onClick={onClose} disabled={isInitiating || isVerifying}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAccountModal;
