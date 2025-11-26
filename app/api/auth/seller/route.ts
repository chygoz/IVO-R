import { NextRequest, NextResponse } from "next/server";
import { signIn, auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Use NextAuth signIn programmatically
    const result = await signIn("seller-login", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    // Get updated session after login
    const session = await auth();

    return NextResponse.json({
      user: session?.user || null,
    });
  } catch (error) {
    console.error("Seller login API error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
