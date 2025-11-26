"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCent, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import WithdrawModal from "./modals/withdraw-modal";
import AddAccountModal from "./modals/add-account-modal";

const WalletActions = () => {
  const { withdrawalAccounts } = useWallet();
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [addAccountModalOpen, setAddAccountModalOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Quick Actions</CardTitle>
          <CardDescription>Manage your funds efficiently</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-between h-auto py-3"
            onClick={() => setWithdrawModalOpen(true)}
          >
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-left">
                <p className="font-medium">Withdraw Funds</p>
                <p className="text-xs text-muted-foreground">
                  {withdrawalAccounts.length
                    ? "To your bank account"
                    : "Add a bank account first"}
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Button>

          <Button
            variant="outline"
            className="w-full justify-between h-auto py-3"
            onClick={() => setAddAccountModalOpen(true)}
          >
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <BadgeCent className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <p className="font-medium">Manage Accounts</p>
                <p className="text-xs text-muted-foreground">
                  {withdrawalAccounts.length
                    ? `${withdrawalAccounts.length} account${
                        withdrawalAccounts.length !== 1 ? "s" : ""
                      } saved`
                    : "Add your withdrawal accounts"}
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Button>
        </CardContent>
      </Card>

      <WithdrawModal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
      />

      <AddAccountModal
        isOpen={addAccountModalOpen}
        onClose={() => setAddAccountModalOpen(false)}
      />
    </motion.div>
  );
};

export default WalletActions;
