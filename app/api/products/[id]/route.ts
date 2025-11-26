import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/api-client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const response = await apiClient.seller.get(`/api/v1/products/${id}`);

    return NextResponse.json(response);
  } catch (error) {
    const { id } = await params;
    console.error(`Error fetching product ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const response = await apiClient.seller.delete(`/api/v1/products/${id}`, {
      requireBusiness: true,
    });

    return NextResponse.json(response);
  } catch (error) {
    const { id } = await params;
    console.error(`Error deleting product ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
