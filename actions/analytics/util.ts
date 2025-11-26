export const SERVER_URL = `${process.env.SERVER_API_URL}/api/v1/analytics`;
export const CLIENT_URL = `/api/v1/analytics`;
export const URL = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/v1/analytics`;

export type IAnalyticPeriod = "last90" | "last30" | "last7";

export type IAnalyticCategory =
  | "transaction"
  | "user"
  | "booking"
  | "customer"
  | "event"
  | "payment-link"
  | "venue"
  | "pitch";
