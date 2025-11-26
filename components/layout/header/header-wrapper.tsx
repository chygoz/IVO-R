import React from "react";
import Header from "./header";
import { auth } from "@/auth";
import { headers } from "next/headers";

async function HeaderWrapper() {
  const [session, headersList] = await Promise.all([auth(), headers()]);
  const reseller = (await headersList).get("x-reseller-name");
  return <Header session={session} reseller={reseller} />;
}

export default HeaderWrapper;
