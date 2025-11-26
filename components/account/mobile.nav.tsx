"use client";
import React, { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IoClose } from "react-icons/io5";
import Scrollbar from "@/components/common/scrollbar";
import { list } from "./nav";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

function AccountMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Menu"
        className="flex md:hidden flex-col items-center justify-center 2xl:px-7 flex-shrink-0 h-full outline-none focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </SheetTrigger>
      <SheetContent>
        <div className="flex flex-col justify-start w-full h-full">
          <div className=" border-b border-gray-100 flex justify-start items-center relative  py-0 gap-6">
            <SheetClose
              className="flex justify-between text-2xl items-center text-gray-500 py-6 lg:py-8 focus:outline-none transition-opacity hover:opacity-60"
              aria-label="close"
            >
              <IoClose className="text-black mt-1 md:mt-0.5" />
            </SheetClose>
          </div>

          <Scrollbar className="menu-scrollbar flex-grow mb-auto">
            <div className="flex flex-col py-7 px-0 lg:px-2 text-heading">
              <ul className="flex flex-col gap-4">
                {list.map((menu, index) => {
                  return (
                    <li onClick={() => setOpen(false)} key={index.toString()}>
                      <Link
                        href={menu.href}
                        className={cn(
                          "py-2.5 px-3.5  block rounded-md text-[#1E1E1E]",
                          pathname === menu.href && "bg-[#F8F8F8]  font-bold",
                          "hover:bg-[#F8F8F8] hover:font-bold"
                        )}
                      >
                        {menu.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Scrollbar>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default AccountMobileNav;
