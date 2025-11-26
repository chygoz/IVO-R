"use server";
import { fetchAPI } from "./config";
import { Banks, ResolveBank } from "./types";

const getBanks = async (): Promise<{ data: Banks[] }> => {
  const res = await fetchAPI({
    url: `/api/v1/accounts/banks`,
  });
  if (res?.error) {
    return { data: [] };
  }
  return res;
};

export default getBanks;

export async function resolveBank(formData: FormData) {
  const accountNumber = formData.get("accountNumber")?.toString();
  const sortCode = formData.get("sortCode")?.toString();

  if (!accountNumber || !sortCode) {
    return { error: true, message: "Missing required fields" };
  }

  try {
    const res = await fetchAPI({
      url: `/api/v1/accounts/resolve/bank`,
      method: "POST",
      body: { accountNumber, sortCode },
    });


    if (res.error) {
      return { error: true, message: res.details };
    }

    return { success: true, data: res.data };
  } catch (error) {
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Failed to resolve bank",
    };
  }
}
