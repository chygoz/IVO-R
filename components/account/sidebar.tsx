"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { list } from "./nav";

function AccountSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden sm:block border-r border-r-solid border-r-[#D1D1D1] py-[30px]  px-8 sm:px-[80px]">
      <nav>
        <ul className="flex flex-col gap-4">
          {list.map((item, index) => (
            <li key={index.toString()}>
              <Link
                href={item.href}
                className={cn(
                  "py-2.5 px-3.5  block rounded-md text-[#1E1E1E]",
                  pathname === item.href && "bg-[#F8F8F8]  font-bold",
                  "hover:bg-[#F8F8F8] hover:font-bold"
                )}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default AccountSidebar;
