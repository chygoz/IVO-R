import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/api-client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const response = await apiClient.seller.get(`/api/v1/submissions/${id}`);

    return NextResponse.json(response);
  } catch (error) {
    const { id } = await params;
    console.error(`Error fetching submission ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch submission" },
      { status: 500 }
    );
  }
}
