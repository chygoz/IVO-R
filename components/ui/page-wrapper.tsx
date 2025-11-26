import React from "react";
import { cn } from "@/lib/utils";

type PageWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

function PageWrapper({ children, className }: PageWrapperProps) {
  return <div className={cn("p-4 md:p-8 ", className)}>{children}</div>;
}

export default PageWrapper;
