"use client";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

type GoBackButtonProps = {
  className?: string;
  children: React.ReactNode;
};

function GoBackButton({ className, children }: GoBackButtonProps) {
  const router = useRouter();
  return (
    <Button className={className} onClick={() => router.back()}>
      {children}
    </Button>
  );
}

export default GoBackButton;
