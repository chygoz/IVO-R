import { safeJsonResponse } from "../utils";

export const updateResellerBusiness = async (options: {
  business: {
    name: string;
    logo: string;
    address: string;
    state: string;
    phone: string;
  };

  config: {
    token: string;
    businessKey: string;
  };
}): Promise<{
  data: {
    name: string;
    slug: string;
    updatedSubdomain: boolean;
  };
}> => {
  const url = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/v1/businesses/me`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${options.config.token}`,
      "x-business-key": options.config.businessKey,
    },
    cache: "no-store",
    body: JSON.stringify(options.business),
  });
  // Handle response errors or return the response
  if (!response.ok) {
    const resError = await safeJsonResponse(response);
    throw new Error(
      `${resError?.message || `${resError?.error}` || "something went wrong"}`
    );
  }

  const data = await safeJsonResponse(response);
  return data;
};
