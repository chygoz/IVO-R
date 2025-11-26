import { cookies } from "next/headers";

export type CookieForwardingOptions = {
  forwardCookies?: boolean;
  cookiesToForward?: string[];
  includeCookieHeaders?: boolean;
};

export class CookieManager {
  /**
   * Get cookies to forward in API requests
   */
  static async getForwardingCookies(
    cookiesToForward: string[] = ["cartId"]
  ): Promise<string> {
    const cookieStore = await cookies();
    const cookieHeaders: string[] = [];

    cookiesToForward.forEach((cookieName) => {
      const cookie = cookieStore.get(cookieName);
      if (cookie) {
        cookieHeaders.push(`${cookie.name}=${cookie.value}`);
      }
    });

    return cookieHeaders.join("; ");
  }

  /**
   * Extract and format Set-Cookie headers from API response
   */
  static extractSetCookieHeaders(response: Response): string[] {
    const setCookieHeaders: string[] = [];

    // Handle both single and multiple Set-Cookie headers
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      setCookieHeaders.push(setCookie);
    }

    // Some servers send multiple Set-Cookie headers
    response.headers.forEach((value, key) => {
      if (
        key.toLowerCase() === "set-cookie" &&
        !setCookieHeaders.includes(value)
      ) {
        setCookieHeaders.push(value);
      }
    });

    return setCookieHeaders;
  }

  /**
   * Parse Set-Cookie header to extract cookie name
   */
  static parseCookieName(setCookieHeader: string): string | null {
    const match = setCookieHeader.match(/^([^=]+)=/);
    return match ? match[1].trim() : null;
  }
}
