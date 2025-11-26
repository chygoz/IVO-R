"use client";

import { useState } from "react";
import { Copy, BadgeCent, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useWallet } from "@/hooks/use-wallet";

const WalletVirtualAccount = () => {
  const { toast } = useToast();
  const { virtualAccount, refreshVirtualAccount, isRefreshing } = useWallet();
  const [isCopying, setIsCopying] = useState<string | null>(null);

  // Function to copy text to clipboard
  const copyToClipboard = async (text: string, type: string) => {
    try {
      setIsCopying(type);
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: `${type} has been copied to your clipboard`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setIsCopying(null), 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Fund Your Wallet</CardTitle>
              <CardDescription>
                Use your dedicated virtual account for deposits
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={refreshVirtualAccount}
              disabled={isRefreshing}
            >
              <RefreshCw
                size={14}
                className={isRefreshing ? "animate-spin" : ""}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {virtualAccount ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Account Number
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-mono font-bold">
                      {virtualAccount.accountNumber}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        copyToClipboard(
                          virtualAccount.accountNumber,
                          "Account number"
                        )
                      }
                    >
                      <Copy
                        size={14}
                        className={
                          isCopying === "Account number" ? "text-green-500" : ""
                        }
                      />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Bank</p>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold">
                      {virtualAccount.bank}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        copyToClipboard(virtualAccount.bank, "Bank name")
                      }
                    >
                      <Copy
                        size={14}
                        className={
                          isCopying === "Bank name" ? "text-green-500" : ""
                        }
                      />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Account Name</p>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-medium">
                    {virtualAccount.name}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      copyToClipboard(virtualAccount.name, "Account name")
                    }
                  >
                    <Copy
                      size={14}
                      className={
                        isCopying === "Account name" ? "text-green-500" : ""
                      }
                    />
                  </Button>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md border border-amber-100 dark:border-amber-900/50 text-sm">
                <p className="text-amber-800 dark:text-amber-300">
                  <strong>Note:</strong> Transfers to this account are processed
                  instantly during business hours. Funds will appear in your
                  wallet balance once processed.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <BadgeCent className="h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-1">
                No virtual account found
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                Contact support to create a virtual account for deposits
              </p>
              <Button
                variant="default"
                onClick={refreshVirtualAccount}
                disabled={isRefreshing}
              >
                {isRefreshing ? "Checking..." : "Check Again"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WalletVirtualAccount;
