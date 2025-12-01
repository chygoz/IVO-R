"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart,
  Settings,
  CreditCard,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

interface DashboardSidebarProps {
  store: {
    id: string;
    name: string;
    logo?: string;
  };
}

export function DashboardSidebar({ store }: DashboardSidebarProps) {
  const pathname = usePathname();
  // Extract storeId from pathname - it's always the first segment
  const storeId = pathname.split("/")[1] || "";

  const navItems = [
    {
      name: "Dashboard",
      href: `/${storeId}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      href: `/${storeId}/dashboard/products`,
      icon: Package,
    },
    {
      name: "Orders",
      href: `/${storeId}/dashboard/orders`,
      icon: ShoppingBag,
    },
    {
      name: "Customers",
      href: `/${storeId}/dashboard/customers`,
      icon: Users,
    },
    {
      name: "Analytics",
      href: `/${storeId}/dashboard/analytics`,
      icon: BarChart,
    },
    {
      name: "Wallet",
      href: `/${storeId}/dashboard/wallet`,
      icon: CreditCard,
    },
    {
      name: "Subscription",
      href: `/${storeId}/dashboard/subscription`,
      icon: CreditCard,
    },
    {
      name: "Settings",
      href: `/${storeId}/dashboard/settings`,
      icon: Settings,
    },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r flex-shrink-0 hidden md:block">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b">
          <Link href={`/${storeId}/dashboard`} className="flex items-center">
            {store.logo ? (
              <Image
                width={400}
                height={400}
                src={store.logo}
                alt={store.name}
                className="size-8 mr-2"
              />
            ) : (
              <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center mr-2">
                <span className="text-primary font-semibold capitalize">
                  {store.name.charAt(0)}
                </span>
              </div>
            )}
            <span className="font-semibold truncate capitalize">
              {store.name}
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm group transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 mr-2 ${
                        isActive ? "text-primary" : "text-gray-500"
                      }`}
                    />
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active-indicator"
                        className="ml-auto"
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </motion.div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <div className="mt-6 px-3">
            <Link
              href={`/${storeId}`}
              className="text-sm text-primary hover:underline flex items-center"
            >
              View Your Store
              <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
