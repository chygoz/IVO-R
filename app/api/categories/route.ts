import { NextResponse } from "next/server";
import { apiClient } from "@/lib/api/api-client";

export async function GET(request: Request) {
  try {
    // Use the apiClient.seller.get method to fetch categories
    // This includes the requireBusiness flag automatically
    const data = await apiClient.seller.get("/api/v1/categories");

    // Return the response directly
    return NextResponse.json({
      status: "ok",
      data: data,
    });
  } catch (error: any) {
    console.error("Error fetching categories:", error);

    // Check if error has a response property (API error)
    let message = "Failed to fetch categories";
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
          message: "Category name is required",
        },
        { status: 400 }
      );
    }

    // No need to generate slug manually
    // The API will handle this based on the provided name

    // Use the apiClient.seller.post method to create a category
    const data = await apiClient.seller.post("/api/v1/categories", {
      name: body.name,
    });

    return NextResponse.json({
      status: "ok",
      data: data,
    });
  } catch (error: any) {
    console.error("Error creating category:", error);

    // Check if error has a response property (API error)
    let message = "Failed to create category";
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
