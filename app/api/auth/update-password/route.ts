import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { apiClient } from "@/lib/api/api-client";

export async function POST(request: NextRequest) {
  try {
    // Get current session
    const session = await auth();

    console.log("updating p");

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    // Call API to update password
    await apiClient.post("/api/v1/auth/password/default", {
      email: session.user.email,
      oldPassword: currentPassword,
      password: newPassword,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update password error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update password",
      },
      { status: 500 }
    );
  }
}
