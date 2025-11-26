import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;

    // Get the cartId from cookies
    const cookieStore = await cookies();
    const session = await auth();
    const cartId = cookieStore.get("cartId")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (cartId) {
      headers["Cookie"] = `cartId=${cartId}`;
    }

    if (session) {
      headers["Authorization"] = `Bearer ${session.user.token}`;
    }

    const response = await fetch(
      `${process.env.SERVER_API_URL}/api/v1/cart/clear?businessId=${storeId}`,
      {
        method: "DELETE",
        headers,
      }
    );

    const data = await response.json();
    const nextResponse = NextResponse.json(data);

    // Forward any Set-Cookie headers
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      nextResponse.headers.set("Set-Cookie", setCookieHeader);
    }

    return nextResponse;
  } catch (error) {
    console.error("Clear cart API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
