import { fetchAPI } from "../config";
import {
  CLIENT_URL,
  IWallet,
  AllBanksResponse,
  ResolveBankResponse,
  initiateWithdrawalResponse,
  Account,
  DVA,
} from "./utils";

export const getWallets = async (): Promise<{
  data: { wallets: IWallet[] };
}> => {
  const res = await fetchAPI({
    url: `${CLIENT_URL}/wallets`,
  });

  return res;
};

export const getAccounts = async (): Promise<{
  data: Account[];
}> => {
  const res = await fetchAPI({
    url: `${CLIENT_URL}`,
    tags: ["accounts"],
  });

  return res;
};
export const getDVa = async (): Promise<{
  data: DVA;
}> => {
  const res = await fetchAPI({
    url: `${CLIENT_URL}/dva`,
    tags: ["dva"],
  });

  return res;
};

export const addDVa = async (
  bvn: string
): Promise<{
  data: any;
}> => {
  const res = await fetchAPI({
    method: "POST",
    url: `${CLIENT_URL}/dva`,
    body: { bvn },
  });

  return res;
};

export const inititateDeleteAccount = async (
  accountId: string
): Promise<initiateWithdrawalResponse> => {
  const res = await fetchAPI({
    method: "DELETE",
    url: `${CLIENT_URL}/${accountId}`,
  });

  return res;
};

export const getAllBanks = async (): Promise<AllBanksResponse> => {
  const res = await fetchAPI({
    url: `${CLIENT_URL}/banks`,
  });

  if (res.error) {
    throw new Error(res.details);
  }

  return res;
};

export const getBankName = async (data: {
  accountNumber: string;
  sortCode: String;
}): Promise<ResolveBankResponse> => {
  const res = await fetchAPI({
    method: "POST",
    url: `${CLIENT_URL}/resolve/bank`,
    body: data,
  });

  if (res.error) {
    throw new Error(res.details);
  }

  return res;
};

export const initiateAddAccount = async (data: {
  accountName: string;
  accountNumber: string;
  bankName: string;
  sortCode: string;
  currency: "NGN" | "USD";
  bankId: string;
}): Promise<initiateWithdrawalResponse> => {
  const res = await fetchAPI({
    method: "POST",
    url: `${CLIENT_URL}`,
    body: data,
  });

  if (res.error) {
    throw new Error(res.details);
  }

  return res;
};

export const verifyOtpAddAccount = async (data: {
  accountId?: string;
  payload: {
    requestId: string;
    otp: string;
  };
}): Promise<initiateWithdrawalResponse> => {
  const res = await fetchAPI({
    method: "POST",
    url: `${CLIENT_URL}`,
    body: data.payload,
  });

  if (res.error) {
    throw new Error(res.details);
  }

  return res;
};

export const verifyOtpDeleteAccount = async (data: {
  accountId?: string;
  payload: {
    requestId: string;
    otp: string;
  };
}): Promise<initiateWithdrawalResponse> => {
  const res = await fetchAPI({
    method: "DELETE",
    url: `${CLIENT_URL}/${data.accountId}`,
    body: data.payload,
  });

  if (res.error) {
    throw new Error(res.details);
  }

  return res;
};
