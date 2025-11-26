"use client";
import { Account } from "@/actions/accounts/utils";
import { Button } from "@/components/ui/button";
import ButtonText from "@/components/ui/buttonText";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";

type NewVenueModalProps = {
  account: Account;
};
export function RemoveWithdrawalAccount({ account }: NewVenueModalProps) {
  const [open, setOpen] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [otp, setOtp] = useState<string>("");
  const [isInitiating, setIsInitiating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const { initiateAccountDelete, confirmAccountDelete } = useWallet();
  const { toast } = useToast();

  const handleInitiateDelete = async () => {
    setIsInitiating(true);
    try {
      const reqId = await initiateAccountDelete(account._id);
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

  const handleConfirmDelete = async () => {
    if (!requestId) return;

    if (!otp || otp.length < 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    setOtpError(null);

    try {
      await confirmAccountDelete(account._id, requestId, otp);
      setOpen(false);
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

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setOtp(value);
      if (otpError) setOtpError(null);
    }
  };
  return (
    <Dialog open={open} onOpenChange={(openState) => {
      setOpen(openState);
      if (!openState) {
        setRequestId(null);
        setOtp("");
        setOtpError(null);
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Delete account">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[80vw] flex flex-col justify-center items-center sm:max-w-[500px] md:min-h-[400px] text-black">
        {!requestId ? (
          <>
            <h4 className="font-bold text-xl text-center">
              Are you sure you want to remove this account?
            </h4>
            <div className="text-center">
              You are about to remove this withdrawal account
              <div className="flex-1 mt-2">
                <p className="text-sm text-gray-500">
                  {account.bankName} - {account.accountNumber}
                </p>
              </div>
            </div>
            <Button
              className="bg-red-500"
              disabled={isInitiating}
              onClick={handleInitiateDelete}
            >
              <ButtonText loading={isInitiating}>Yes, Continue</ButtonText>
            </Button>
          </>
        ) : (
          <>
            <h4 className="font-bold text-xl text-center">
              Verify OTP
            </h4>
            <div className="text-center">
              We&apos;ve sent a 6-digit verification code to your registered email address.
            </div>
            <div className="w-full max-w-xs">
              <Input
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
            <Button
              className="bg-red-500"
              disabled={isVerifying}
              onClick={handleConfirmDelete}
            >
              <ButtonText loading={isVerifying}>Confirm Delete</ButtonText>
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
