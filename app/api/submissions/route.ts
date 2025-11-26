import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/api-client";

export async function GET(request: NextRequest) {
  try {
    // Call the API to get seller submissions
    const response = await apiClient.seller.get("/api/v1/submissions/me");

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Call the API to create a submission
    const response = await apiClient.seller.post("/api/v1/submissions", body);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json(
      { error: "Failed to create submission" },
      { status: 500 }
    );
  }
}
