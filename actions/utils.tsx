export function toQueryParams(
  params: Record<string, string | number | boolean>
): string {
  if (!params) {
    return "";
  }
  const queryString = Object.keys(params)
    .map((key) => {
      // Encode both key and value to handle special characters
      const value = encodeURIComponent(params[key]);
      return `${encodeURIComponent(key)}=${value}`;
    })
    .join("&");

  return queryString ? `?${queryString}` : "";
}

export async function safeJsonResponse(response: Response) {
  try {
    // Check if response has a JSON content type
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      console.warn("Response is not JSON, returning raw text.");
      return await response.text(); // Return text if not JSON
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}
