"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { formatCurrency } from "@/lib/utils";

const WalletOverview = () => {
  const { wallets, activeWalletCurrency, setActiveWalletCurrency } =
    useWallet();
  const [hideBalance, setHideBalance] = useState(false);

  // Find the active wallet
  const activeWallet =
    wallets.find((wallet) => wallet.currency === activeWalletCurrency) ||
    wallets[0];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-bold tracking-tight">Wallet</h1>
          <p className="text-muted-foreground">
            Manage your funds and transactions
          </p>
        </motion.div>

        {wallets.length > 1 && (
          <motion.div variants={itemVariants}>
            <Tabs
              value={activeWalletCurrency}
              onValueChange={setActiveWalletCurrency}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-[200px]">
                {wallets.map((wallet) => (
                  <TabsTrigger
                    key={wallet.currency}
                    value={wallet.currency}
                    className="text-sm"
                  >
                    {wallet.currency}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div variants={itemVariants}>
          <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available Balance
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setHideBalance(!hideBalance)}
                className="h-8 w-8"
              >
                {hideBalance ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <div className="text-3xl font-bold">
                {hideBalance
                  ? "••••••"
                  : formatCurrency(
                      activeWallet?.availableBalance || 0,
                      activeWallet?.currency || "NGN"
                    )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Funds you can withdraw or use for payments
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Balance
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setHideBalance(!hideBalance)}
                className="h-8 w-8"
              >
                {hideBalance ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <div className="text-3xl font-bold">
                {hideBalance
                  ? "••••••"
                  : formatCurrency(
                      activeWallet?.pendingBalance || 0,
                      activeWallet?.currency || "NGN"
                    )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Funds being processed that will be available soon
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WalletOverview;
