import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import GoBackButton from "@/components/goBackButton";
import Link from "next/link";
import { getAccounts } from "@/actions/accounts";
import { Suspense } from "react";
import { RemoveWithdrawalAccount } from "./remove.account";

interface WithdrawalAccount {
  id: string;
  accountNumber: string;
  bankName: string;
  accountHolder: string;
}

export default async function WithdrawalAccountsPage() {
  const response = await getAccounts();
  const accounts = response.data || [];

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <GoBackButton className="!bg-[#F6F6F9] text-black gap-1 shadow-none">
        <svg
          width="12"
          height="10"
          viewBox="0 0 12 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.5 5H0.5M0.5 5L5 0.5M0.5 5L5 9.5"
            stroke="#5E718D"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back
      </GoBackButton>
      <div className="flex items-center mb-2">
        <h1 className="text-2xl font-medium">
          Manage your Withdrawal Accounts
        </h1>
      </div>

      <p className="text-gray-600 mb-6">
        You can add withdrawal accounts below.
      </p>

      <Suspense fallback={<div>...please wait</div>}>
        {accounts.length ? (
          <ul className="flex flex-col gap-4">
            {accounts.map((account) => (
              <Card
                key={account._id}
                className="flex items-center p-4 relative"
              >
                <div className="flex-1">
                  <p className="font-medium">{account.accountNumber}</p>
                  <p className="text-sm text-gray-600">
                    {account.bankName} - {account.accountName}
                  </p>
                </div>
                <RemoveWithdrawalAccount account={account} />
              </Card>
            ))}
          </ul>
        ) : (
          <div>You do not have any withdraw accounts.</div>
        )}
      </Suspense>

      <Button className="w-full mt-6 bg-primary hover:bg-primary/80" asChild>
        <Link href="/admin/wallet/withdraw-accounts/new">Add New Account</Link>
      </Button>
    </div>
  );
}
