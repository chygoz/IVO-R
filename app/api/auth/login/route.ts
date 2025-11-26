import { NextRequest, NextResponse } from "next/server";
import { doCredentialLogin } from "@/actions/login";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    // Use the authorize function from Next-auth setup
    const signInResult = await doCredentialLogin(formData, "login");

    // Handle error in signInResult
    if (
      signInResult &&
      typeof signInResult === "object" &&
      "error" in signInResult
    ) {
      return NextResponse.json(
        { error: signInResult.error || "Authentication failed" },
        { status: 401 }
      );
    }

    // If signInResult is a string, it's the redirect URL from next-auth (success case)
    if (typeof signInResult === "string" || signInResult?.user) {
      // Simply return success
      return NextResponse.json({
        success: true,
      });
    }

    // If we get here, something unexpected happened
    return NextResponse.json(
      { error: "Authentication process failed with an unexpected result" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
