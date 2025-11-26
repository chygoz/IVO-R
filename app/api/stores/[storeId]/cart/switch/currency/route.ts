import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const currency = searchParams.get("currency");
    const { storeId } = await params;

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
      `${process.env.SERVER_API_URL}/api/v1/cart/switch/currency?businessId=${storeId}&currency=${currency}`,
      {
        method: "PUT",
        headers,
      }
    );

    const data = await response.json();
    const nextResponse = NextResponse.json(data);

    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      nextResponse.headers.set("Set-Cookie", setCookieHeader);
    }

    return nextResponse;
  } catch (error) {
    console.error("Switch currency API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to switch currency" },
      { status: 500 }
    );
  }
}
