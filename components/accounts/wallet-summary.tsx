"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { IWallet } from "@/actions/accounts/utils";
import { formatCurrency } from "@/lib/utils";

type WalletSummaryProps = {
  wallets: IWallet[];
  currency?: string;
};

function WalletSummary({ wallets, currency }: WalletSummaryProps) {
  const currentWallet = wallets.find((wallet) => {
    if (currency === "NGN" || currency === "USD") {
      return wallet.currency === currency;
    }

    return wallet.currency === "NGN";
  });
  const [hideBalance, setHideBalance] = useState(false);

  const toggleBalanceVisibility = () => {
    setHideBalance(!hideBalance);
  };

  // Function to render balance or asterisks
  const renderBalance = (amount: string) => {
    return hideBalance ? "****" : amount;
  };

  if (!currentWallet) {
    return <div>You do not have any wallet</div>;
  }

  return (
    <div className="relative mt-4">
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
          onClick={toggleBalanceVisibility}
        >
          {hideBalance ? (
            <>
              <Eye className="h-4 w-4" />
              <span className="text-sm">Show Balance</span>
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4" />
              <span className="text-sm">Hide Balance</span>
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {/* Available Balance Card */}
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <svg
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.417 15L19.417 10.625M6.91699 15L1.91699 10.625M14.417 5L19.417 9.375M6.91699 5L1.91699 9.375M2.54199 5H18.792C19.1372 5 19.417 5.27982 19.417 5.625V14.375C19.417 14.7202 19.1372 15 18.792 15H2.54199C2.19681 15 1.91699 14.7202 1.91699 14.375V5.625C1.91699 5.27982 2.19681 5 2.54199 5ZM13.167 10C13.167 11.3807 12.0477 12.5 10.667 12.5C9.28628 12.5 8.16699 11.3807 8.16699 10C8.16699 8.61929 9.28628 7.5 10.667 7.5C12.0477 7.5 13.167 8.61929 13.167 10Z"
                      stroke="#11A75C"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-gray-700">Available Balance</span>
              </div>
              <h2 className="text-3xl font-bold">
                {renderBalance(
                  formatCurrency(
                    currentWallet.availableBalance,
                    currentWallet.currency
                  )
                )}
              </h2>
            </div>
          </CardContent>
        </Card>

        {/* Book Balance Card */}
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 9.375H6.93826C7.08225 9.37497 7.22182 9.42473 7.33331 9.51585C7.4448 9.60696 7.52136 9.73383 7.55 9.87494C7.66536 10.4396 7.97221 10.947 8.41864 11.3115C8.86508 11.6759 9.4237 11.875 10 11.875C10.5763 11.875 11.1349 11.6759 11.5814 11.3115C12.0278 10.947 12.3346 10.4396 12.45 9.87494C12.4787 9.73383 12.5552 9.60696 12.6667 9.51585C12.7782 9.42474 12.9178 9.37497 13.0617 9.375H17.5M2.5 6.875H17.5M3.75 4.375H16.25C16.9404 4.375 17.5 4.93464 17.5 5.625V14.375C17.5 15.0654 16.9404 15.625 16.25 15.625H3.75C3.05964 15.625 2.5 15.0654 2.5 14.375V5.625C2.5 4.93464 3.05964 4.375 3.75 4.375Z"
                      stroke="#1B4DFF"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-gray-700">Book Balance</span>
              </div>
              <h2 className="text-3xl font-bold">
                {renderBalance(
                  formatCurrency(
                    currentWallet.pendingBalance,
                    currentWallet.currency
                  )
                )}
              </h2>
            </div>
          </CardContent>
        </Card>

        {/* Total Sales Card */}
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                    <svg
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.54194 8.125V5.625C7.54194 4.7962 7.87118 4.00134 8.45723 3.41529C9.04329 2.82924 9.83814 2.5 10.6669 2.5C11.4957 2.5 12.2906 2.82924 12.8767 3.41529C13.4627 4.00134 13.7919 4.7962 13.7919 5.625V8.125M16.9825 5.625H4.35135C4.19754 5.625 4.04913 5.68172 3.93452 5.7843C3.81991 5.88687 3.74715 6.02811 3.73017 6.18098L2.61906 16.181C2.60935 16.2683 2.61818 16.3568 2.64497 16.4405C2.67176 16.5242 2.71591 16.6013 2.77453 16.6668C2.83315 16.7323 2.90493 16.7847 2.98518 16.8206C3.06542 16.8565 3.15234 16.875 3.24023 16.875H18.0937C18.1816 16.875 18.2685 16.8565 18.3487 16.8206C18.429 16.7847 18.5007 16.7323 18.5594 16.6668C18.618 16.6013 18.6621 16.5242 18.6889 16.4405C18.7157 16.3568 18.7245 16.2683 18.7148 16.181L17.6037 6.18098C17.5867 6.02811 17.514 5.88687 17.3994 5.7843C17.2848 5.68172 17.1364 5.625 16.9825 5.625Z"
                        stroke="#FFC700"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">Total Sales</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-gray-700 hover:text-gray-700 hover:bg-gray-100"
                >
                  Monthly
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <h2 className="text-3xl font-bold">
                {renderBalance(formatCurrency(0, currentWallet.currency))}
              </h2>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default WalletSummary;
