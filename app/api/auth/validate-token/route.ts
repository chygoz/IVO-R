import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  exp?: number;
  iat?: number;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { valid: false, error: "No session found" },
        { status: 401 }
      );
    }

    const user = session.user as any;

    if (!user.token) {
      return NextResponse.json(
        { valid: false, error: "No token found" },
        { status: 401 }
      );
    }

    // Decode and validate JWT token
    try {
      const decoded = jwtDecode<JWTPayload>(user.token);

      // Check if token is expired
      if (decoded.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
          return NextResponse.json(
            { valid: false, error: "Token expired" },
            { status: 401 }
          );
        }
      }

      return NextResponse.json({
        valid: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        expiresAt: decoded.exp ? decoded.exp * 1000 : null,
      });
    } catch (decodeError) {
      return NextResponse.json(
        { valid: false, error: "Invalid token format" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { valid: false, error: "Token validation failed" },
      { status: 500 }
    );
  }
}
