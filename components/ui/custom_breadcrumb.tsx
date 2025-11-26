"use client";
import React from "react";
import { usePathname } from "next/navigation";

interface BreadcrumbProps {
  items: { label: string; href: string }[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  const pathname = usePathname(); // Get the current route

  return (
    <nav className={`flex w-full items-center space-x-1 sm:space-x-2 text-md sm:mt-0 sm:text-md text-muted-foreground ${className}`}>
      {items.map((item, index) => {
        const isActive = pathname === item.href; // Check if the item is active
        return (
          <div key={index} className="flex items-center">
            <a
              href={item.href}
              className={`${
                isActive
                  ? "font-bold sm:text-md"
                  : "text-muted-foreground hover:text-foreground text-md"
              } transition-colors`}
            >
              {item.label}
            </a>
            {index < items.length - 1 && <p className="pl-1 sm:pl-2"> /</p>}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
