"use server";

import { unstable_update } from "@/auth";

export async function updateUserSession(payLoad: any) {
  await unstable_update({ user: payLoad });
}
