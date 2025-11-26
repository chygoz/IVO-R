import { safeJsonResponse } from "../utils";

export const updateResellerStorefront = async (options: {
  storefrontTheme: {
    primaryColor: string;
    secondaryColor: string;
    bannerImage: string;
  };
  config: {
    token: string;
    businessKey: string;
  };
}) => {
  const url = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/v1/resellers/storefront`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${options.config.token}`,
      "x-business-key": options.config.businessKey,
    },
    cache: "no-store",
    body: JSON.stringify(options.storefrontTheme),
  });
  // Handle response errors or return the response
  if (!response.ok) {
    const resError = await safeJsonResponse(response);
    console.log(JSON.stringify(resError.errors));
    throw new Error(
      `${resError?.message || `${resError?.error}` || "something went wrong"}`
    );
  }

  const data = await safeJsonResponse(response);
  return data;
};
