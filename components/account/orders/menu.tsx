"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function OrderMenu() {
  const pathname = usePathname();
  const list = [
    { name: "All Orders", href: "/account/orders" },
    { name: "To Be Received", href: "/account/orders/to-be-received" },
    { name: "Completed", href: "/account/orders/completed" },
    { name: "Cancelled", href: "/account/orders/cancelled" },
  ];
  return (
    <nav className="w-full">
      <ul className="flex items-center sm:justify-between flex-nowrap w-full gap-8 overflow-x-scroll">
        {list.map((item, index) => (
          <li key={index.toString()}>
            <Link
              href={item.href}
              className={cn(
                "block shrink-0",
                pathname === item.href && "text-primary-500 font-bold"
              )}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default OrderMenu;
