// /api/v1/accounts

import { fetchAPI } from "./config";
import {  Account } from "./types";

const getAccount = async (id: string): Promise<{ data: Account | null }> => {
  const res = await fetchAPI({ url: `/api/v1/account/${id}` });

  if (res.error) {
    return { data: null };
  }

  return res;
};

export default getAccount;