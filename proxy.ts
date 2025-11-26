import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getResellerBySubdomain } from "./actions/resellers";
import { PROTOCOL } from "./constants";
import { removeDot } from "./utils/remote-dot";
import { auth } from "@/auth";
import { jwtDecode } from "jwt-decode";

// Define protected route patterns
const PROTECTED_ROUTES = ["/account", "/dashboard"];

interface JWTPayload {
  exp?: number;
  iat?: number;
  [key: string]: any;
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

function isTokenExpired(token: string): boolean {
  if (!token) return true;

  try {
    const decoded = jwtDecode<JWTPayload>(token);

    // Check if token has exp claim (JWT standard)
    if (decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    }

    // If no expiration info, consider it expired for safety
    return true;
  } catch (error) {
    // If token can't be decoded, consider it invalid/expired
    console.error("Failed to decode token:", error);
    return true;
  }
}

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;
  const hostname = request.headers.get("host") || "";

  // Skip for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if this is a protected route
  if (isProtectedRoute(pathname)) {
    try {
      const session = await auth();

      // If no session exists, redirect to login
      if (!session || !session.user) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Check if token exists and is valid
      const user = session.user as any;
      if (!user.token || isTokenExpired(user.token)) {
        // Token is expired, redirect to login
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        loginUrl.searchParams.set("expired", "true");
        return NextResponse.redirect(loginUrl);
      }

      // Token is valid, continue with the request
    } catch (error) {
      console.error("Auth check failed:", error);
      // On auth error, redirect to login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Handle custom domains (excluding the main domain)
  const mainDomain = removeDot(process.env.ROOT_DOMAIN || "resellerivo.com");

  // For local development
  const isLocalhost =
    hostname === "localhost" || hostname.startsWith("localhost:");

  // Check if we're on the main domain or a subdomain
  const isMainDomain =
    hostname === mainDomain || hostname === `www.${mainDomain}` || isLocalhost;

  // If we're on the main domain, let's check if this is a dashboard route
  if (isMainDomain && pathname.startsWith("/dashboard")) {
    // Dashboard routes are already protected above, so continue
    return NextResponse.next();
  }

  // If we're on a subdomain or a custom path format indicating a store
  if (!isMainDomain) {
    // Extract the subdomain
    const subdomain = hostname.replace(`.${mainDomain}`, "");

    if (subdomain) {
      let store = null;
      // Fetch the store
      try {
        const resellerRes = await getResellerBySubdomain(subdomain);
        if (resellerRes._id) {
          store = resellerRes;
        }
      } catch (error) {
        console.log("no store");
      }

      if (store) {
        // Rewrite to the store route using the subdomain (storeId param expects subdomain)
        url.pathname = `/${subdomain}${pathname}`;
        const response = NextResponse.next();
        response.headers.set("x-subdomain", subdomain);

        return NextResponse.rewrite(url);
      } else {
        return NextResponse.redirect(`${PROTOCOL}://${mainDomain}`);
      }
    }
  }

  // For everything else on the main domain, proceed normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths except:
    // 1. /api routes
    // 2. /_next (Next.js internals)
    // 3. All static files
    "/((?!api|_next|.*\\..*).*)",
  ],
};
