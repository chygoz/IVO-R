"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Wallet, BarChart3, ReceiptText, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

const WalletHeader: React.FC = () => {
  const pathname = usePathname();
  const params = useParams() as { storeId?: string };
  const storeId = params.storeId;
  const isPathBased = pathname?.startsWith(`/${storeId}`);
  const base = isPathBased ? `/${storeId}` : "";
  const { storeTheme } = useTheme();

  const links = [
    {
      name: "Overview",
      href: `${base}/dashboard/wallet`,
      icon: Wallet,
      exact: true,
    },
    {
      name: "Transactions",
      href: `${base}/dashboard/wallet/transactions`,
      icon: ReceiptText,
      exact: false,
    },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-sm"
      style={{
        borderColor: `${storeTheme.colors.primary}20`,
        backgroundColor: `${storeTheme.colors.background}CC`,
      }}
    >
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a className="flex items-center space-x-2" href={`${base}/dashboard`}>
            <span
              className="font-bold text-lg hidden sm:inline-block"
              style={{ color: storeTheme.colors.primary }}
            >
              {storeTheme.name}
            </span>
          </a>
        </div>
        <div className="flex items-center justify-between space-x-2 w-full">
          <nav className="flex items-center space-x-4 lg:space-x-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  isActive(link.href, link.exact)
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
                style={
                  {
                    color: isActive(link.href, link.exact)
                      ? storeTheme.colors.primary
                      : undefined,
                    "--hover-color": storeTheme.colors.primary,
                  } as React.CSSProperties
                }
              >
                <link.icon className="mr-2 h-4 w-4" />
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <Link
              href={`${base}/dashboard`}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default WalletHeader;
