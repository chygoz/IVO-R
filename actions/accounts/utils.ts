export const CLIENT_URL = `/api/v1/accounts`;

export interface IWallet {
  _id: string;
  businessId: string;
  availableBalance: number;
  pendingBalance: number;
  currency: "USD" | "NGN";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface initiateWithdrawalResponse {
  requestId: string;
}

export interface AllBanksResponse {
  data: {
    id: number;
    code: string;
    name: string;
  }[];
}
export interface ResolveBankResponse {
  data: {
    account_number: string;
    account_name: string;
  };
}

export interface Account {
  bankName: string;
  bankId: string;
  accountName: string;
  currency: "NGN" | "USD";
  accountNumber: string;
  sortCode: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DVA {
  accountNumber: string;
  currency: "NGN" | "USD";
  name: string;
  bank: string;
}
