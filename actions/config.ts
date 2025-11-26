"use server";
import { auth } from "@/auth";
import { parseSetCookieHeader } from "@/utils/cookie";
import { cookies } from "next/headers";
import { safeJsonResponse } from "./utils";

type FetchAPIProps = {
  form?: boolean;
  url: string;
  method?: string;
  cache?: RequestCache;
  includeCredential?: boolean;
  body?: any;
  tags?: string[];
};

export async function fetchAPI({
  url,
  method = "GET",
  body,
  tags,
  form,
  cache,
  includeCredential,
}: FetchAPIProps) {
  try {
    // Get the current session with the token
    const session = await auth();
    // Get the current session with the token
    const cookieStore = await cookies();
    const BASE_URL = process.env.SERVER_API_URL;
    const FULL_PATH = `${BASE_URL}${url}`;

    const existingCartId = cookieStore.get("cartId");

    // Add the token to the headers
    const headers: HeadersInit = {
      ...(!form ? { "Content-Type": "application/json" } : {}),
      ...(existingCartId ? { Cookie: `cartId=${existingCartId.value}` } : {}),
      ...(session?.user?.token
        ? { Authorization: `Bearer ${session.user.token}` }
        : {}),
    };

    const options: RequestInit = {
      method,
      headers,
      ...(tags?.length ? { next: { tags } } : {}),
      credentials: includeCredential ? "include" : "same-origin",
      cache: cache ? cache : "no-store",
    };
    //console.log(options.headers, options, "options", cookieStore.get("token"), "token")
    // If there's a body, add it to the request
    if (body) {
      options.body = form ? body : JSON.stringify(body);
    }

    // Fetch the API

    const response = await fetch(FULL_PATH, options);

    // Handle response errors or return the response
    if (!response.ok) {
      const resError = await safeJsonResponse(response);
      console.log(JSON.stringify(resError.errors));
      throw new Error(
        `${resError?.message || `${resError?.error}` || "something went wrong"}`
      );
    }

    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      const parsedCookie = parseSetCookieHeader(setCookieHeader);

      if (parsedCookie && parsedCookie.name === "cartId") {
        const { attributes } = parsedCookie;

        (await cookies()).set(parsedCookie.name, parsedCookie.value, {
          ...(attributes.maxAge !== undefined && {
            maxAge: attributes.maxAge,
          }),
          ...(attributes.expires && {
            expires: new Date(attributes.expires),
          }),
          ...(attributes.path && { path: attributes.path }),
          ...(attributes.domain && { domain: attributes.domain }),
          ...(attributes.secure !== undefined && {
            secure: attributes.secure,
          }),
          ...(attributes.httpOnly !== undefined && {
            httpOnly: attributes.httpOnly,
          }),
          ...(attributes.sameSite && { sameSite: attributes.sameSite }),
        });
      }
    }

    const data = await safeJsonResponse(response);
    if (method === "POST") {
      console.log("POST");
      console.log(data, "data");
    }

    return data;
  } catch (error) {
    return {
      error: true,
      message: "An unexpected error occurred",
      details:
        typeof error === "string"
          ? error
          : //@ts-expect-error fix
            error?.message || "something is wrong", // Be cautious with exposing details
    };
  }
}
