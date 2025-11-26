import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import Link from "next/link";
import { DVA } from "@/actions/accounts/utils";

type QuickActionsProps = {
  dva: DVA;
};

function QuickActions({ dva }: QuickActionsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-900">Quick Action</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Fund your wallet card */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Fund your wallet
            </CardTitle>
            <CardDescription className="text-gray-700">
              Explore a seemly easy way of adding funds to your wallet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <div>
                <p className="text-xl font-medium">{dva.accountNumber}</p>
                <p className="text-sm text-gray-600 capitalize">
                  {dva.bank} - {dva.name}
                </p>
              </div>
              <Button variant="ghost" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Withdraw funds card */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Withdraw funds from wallet
            </CardTitle>
            <CardDescription className="text-gray-700">
              You can easily withdraw your funds directly to your bank
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              Withdraw
            </Button>
          </CardContent>
        </Card>

        {/* Manage withdrawal accounts card */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Manage your Withdrawal Accounts
            </CardTitle>
            <CardDescription className="text-gray-700">
              You can add withdrawal accounts below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/admin/wallet/withdraw-accounts">
                Manage Accounts
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default QuickActions;
