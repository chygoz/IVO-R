import { NextRequest, NextResponse } from "next/server";
import { productQuerySchema } from "@/types/product";
import { apiClient } from "@/lib/api/api-client";

export async function GET(request: NextRequest) {
  try {
    // Get search params
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};

    // Convert searchParams to object
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // Validate and parse query params
    const validatedParams = productQuerySchema.parse({
      ...params,
      business: params.business || "",
      p: Number(params.p || 1),
      l: Number(params.l || 10),
    });

    // Build the query string correctly
    const queryString = new URLSearchParams();
    Object.entries(validatedParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((val) => queryString.append(key, val.toString()));
        } else {
          queryString.append(key, value.toString());
        }
      }
    });

    // Call the API with proper query string
    const response = await apiClient.seller.get(
      `/api/v1/products/business?${queryString.toString()}`
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("try");
    // Call the API to create a product
    const response = await apiClient.seller.post(
      `/api/v1/products?business=${body.businessId}`,
      body,
      {
        requireBusiness: true,
      }
    );

    console.log("res", response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
