import { NextRequest, NextResponse } from "next/server";

const SERVER_API_URL = process.env.SERVER_API_URL;

if (!SERVER_API_URL) {
  console.error("SERVER_API_URL environment variable is not set");
}

export async function POST(req: NextRequest) {
  try {
    // Get the formData from the incoming request
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Create a new FormData object to forward to your server
    const forwardFormData = new FormData();
    forwardFormData.append("file", file);

    // Forward the request to your server
    const response = await fetch(`${SERVER_API_URL}/api/v1/images`, {
      method: "POST",
      body: forwardFormData,
      // Don't set Content-Type header - the browser will set it with the correct boundary
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    // Parse and return the response from your server
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { publicId } = await req.json();

    if (!publicId) {
      return NextResponse.json(
        { error: "Public ID is required" },
        { status: 400 }
      );
    }

    // Forward the deletion request to your server
    const response = await fetch(`${SERVER_API_URL}/api/v1/images`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
