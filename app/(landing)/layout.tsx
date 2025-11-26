import AppLayout from "@/components/layout";
import React from "react";

type PublicLayoutProps = {
  children: React.ReactNode;
};

function PublicLayout({ children }: PublicLayoutProps) {
  return <AppLayout>{children}</AppLayout>;
}

export default PublicLayout;
