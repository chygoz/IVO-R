"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./button";

function BackButton() {
  const router = useRouter();
  return <Button onClick={() => router.back()}>Go Back</Button>;
}

export default BackButton;
