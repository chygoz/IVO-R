"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Box,
  ClipboardList,
  Users,
  BarChart2,
  Wallet,
  Store,
  Menu,
  X,
} from "lucide-react";

const MobileMenuBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (url: string) => {
    
    // For the main dashboard ("/admin"), match exactly.
    if (url === "/admin") return pathname === url;

    // For nested routes, check if the pathname starts with the menu item's URL.
    return pathname === url || pathname.startsWith(url + "/");
  };
  const menuItems = [
    { title: "Dashboard", url: "/admin", icon: Home },
    { title: "Product", url: "/admin/product-management", icon: Box },
    { title: "Orders", url: "/admin/order-management", icon: ClipboardList },
    { title: "Customers", url: "/admin/customer-management", icon: Users },
    { title: "Analytics", url: "/admin/analytics", icon: BarChart2 },
    { title: "Branding", url: "/admin/storefront-branding", icon: Store },
    { title: "Wallet", url: "/admin/wallet", icon: Wallet },
    { title: "Subscription", url: "/admin/subscription", icon: Wallet },
  ];

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        className=" top-4 left-4  md:hidden p-2 bg-gray-100 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Sidebar Menu */}
      <aside
        className={`fixed z-50 top-0 left-0 h-full w-64 bg-white shadow-lg transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out md:hidden`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-2 text-gray-600"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Navigation Links */}
        <nav className="mt-12">
          {menuItems.map(({ title, url, icon: Icon }) => (
            <Link
              key={title}
              href={url}
              className={`flex items-center gap-3 p-3 text-lg ${isActive(url) ? "text-primary bg-gray-100" : "text-gray-700"
                } hover:bg-gray-100`}
              onClick={() => setIsOpen(false)}
            >
              <Icon className="w-5 h-5" />
              {title}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Background Overlay (Closes Menu When Clicked) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default MobileMenuBar;
