import { NextResponse } from "next/server";
import { apiClient } from "@/lib/api/api-client";

export async function GET(request: Request) {
  try {
    // This includes the requireBusiness flag automatically
    const data = await apiClient.seller.get("/api/v1/collections");

    // Return the response directly
    return NextResponse.json({
      status: "ok",
      data: data,
    });
  } catch (error: any) {
    console.error("Error fetching collections:", error);

    // Check if error has a response property (API error)
    let message = "Failed to fetch collections";
    let status = 500;

    if (error.response) {
      message = error.response.data?.message || message;
      status = error.response.status || status;
    }

    return NextResponse.json(
      {
        status: "error",
        message: message,
      },
      { status: status }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    if (!body.name) {
      return NextResponse.json(
        {
          status: "error",
          message: "Collection name is required",
        },
        { status: 400 }
      );
    }

    // No need to generate slug or add business ID manually
    // The API will handle this based on the authenticated business

    const data = await apiClient.seller.post("/api/v1/collections", {
      name: body.name,
      description: body.description || "",
    });

    return NextResponse.json({
      status: "ok",
      data: data,
    });
  } catch (error: any) {
    console.error("Error creating collection:", error);

    // Check if error has a response property (API error)
    let message = "Failed to create collection";
    let status = 500;

    if (error.response) {
      message = error.response.data?.message || message;
      status = error.response.status || status;
    }

    return NextResponse.json(
      {
        status: "error",
        message: message,
      },
      { status: status }
    );
  }
}
