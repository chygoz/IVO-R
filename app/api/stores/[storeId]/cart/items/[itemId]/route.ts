import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string; itemId: string }> }
) {
  try {
    const { storeId, itemId } = await params;

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
      `${process.env.SERVER_API_URL}/api/v1/cart/items/${itemId}?businessId=${storeId}`,
      {
        method: "DELETE",
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
    console.error("Remove cart item API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove item" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string; itemId: string }> }
) {
  try {
    const { storeId, itemId } = await params;
    const body = await request.json();

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
      `${process.env.SERVER_API_URL}/api/v1/cart/items/${itemId}?businessId=${storeId}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
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
    console.error("Update cart item API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update item" },
      { status: 500 }
    );
  }
}
