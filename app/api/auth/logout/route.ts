import { NextRequest, NextResponse } from "next/server";
import { signOut } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    await signOut({ redirect: false });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
