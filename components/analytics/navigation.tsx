"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BarChart3, ShoppingBag, Home } from "lucide-react";

export default function AnalyticsNavigation() {
  const pathname = usePathname();
  const base = `/${(pathname.split("/")[1] || "").trim()}`;

  const links = [
    { href: base, label: "Home", icon: Home },
    { href: `${base}/dashboard`, label: "Dashboard", icon: ShoppingBag },
    { href: `${base}/dashboard/analytics`, label: "Analytics", icon: BarChart3 },
  ];

  return (
    <nav className="flex items-center space-x-4 mb-6">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              className="flex items-center"
            >
              <Icon className="mr-2 h-4 w-4" />
              {link.label}
            </motion.div>
            {isActive && (
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 w-full bg-primary"
                layoutId="activeTab"
                transition={{ duration: 0.2 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
