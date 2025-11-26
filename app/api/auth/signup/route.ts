import { NextRequest, NextResponse } from "next/server";
import { doRegister } from "@/actions/login";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Use the authorize function from Next-auth setup
    const signInResult = await doRegister(body);
    // Handle error in signInResult
    if (!signInResult?.success) {
      console.error("Registration error:", signInResult.error);
      return NextResponse.json(
        {
          error:
            signInResult.message ||
            signInResult.error ||
            "Authentication failed",
        },
        { status: 401 }
      );
    }

    if (signInResult?.success) {
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
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
