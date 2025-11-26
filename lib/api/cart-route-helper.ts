import { NextResponse } from "next/server";

export function createCartResponse<T = any>(apiResponse: any): NextResponse {
  const nextResponse = NextResponse.json(apiResponse);

  // Forward all Set-Cookie headers from the API response
  apiResponse.setCookieHeaders.forEach((cookieHeader: any, index: any) => {
    if (index === 0) {
      nextResponse.headers.set("Set-Cookie", cookieHeader);
    } else {
      nextResponse.headers.append("Set-Cookie", cookieHeader);
    }
  });

  return nextResponse;
}
