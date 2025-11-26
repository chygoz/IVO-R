interface CookieAttributes {
  maxAge?: number;
  expires?: string;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

export const parseSetCookieHeader = (
  setCookieHeader: string
): { name: string; value: string; attributes: CookieAttributes } | null => {
  try {
    // Split the cookie string by semicolons
    const parts = setCookieHeader.split(";").map((part) => part.trim());

    // First part is the name=value
    const [nameValue] = parts;
    const [name, value] = nameValue.split("=");

    if (!name || !value) return null;

    // Parse remaining attributes
    const attributes: CookieAttributes = {};

    parts.slice(1).forEach((part) => {
      const [attrName, attrValue] = part.split("=");
      const lowerAttrName = attrName.toLowerCase().trim();

      switch (lowerAttrName) {
        case "max-age":
          attributes.maxAge = parseInt(attrValue, 10);
          break;
        case "expires":
          attributes.expires = attrValue;
          break;
        case "path":
          attributes.path = attrValue;
          break;
        case "domain":
          attributes.domain = attrValue;
          break;
        case "secure":
          attributes.secure = true;
          break;
        case "httponly":
          attributes.httpOnly = true;
          break;
        case "samesite":
          attributes.sameSite = attrValue.toLowerCase() as
            | "strict"
            | "lax"
            | "none";
          break;
      }
    });

    return { name, value, attributes };
  } catch (error) {
    console.error("Error parsing set-cookie header:", error);
    return null;
  }
};
