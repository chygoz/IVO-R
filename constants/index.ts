export const NAIRA_DOLLAR_RATE = "1540";
export const AFRICA_SHIPPING_COST: ShippingCost = {
  currency: "NGN",
  value: "18500",
  duration: "7 - 10 working days",
  type: "flat",
};
export const EUROPE_SHIPPING_COST: ShippingCost = {
  currency: "NGN",
  value: "31000",
  duration: "7 - 10 working days",
  type: "flat",
};
export const US_SHIPPING_COST: ShippingCost = {
  currency: "NGN",
  value: "41000",
  duration: "7 - 10 working days",
  type: "flat",
};
export const NIGERIA_SHIPPING_COST: ShippingCost = {
  currency: "NGN",
  value: "11500",
  duration: "5 - 7 working days",
  type: "flat",
};

export interface ShippingCost {
  currency: "USD" | "NGN";
  value: string;
  duration: string;
  type: "per-weight" | "flat";
  per?: "kg" | "gram";
}

export const NOT_A_RESELLER = "not allowed";
export const NEEDS_PASSWORDS_CHANGE =
  "You are required to change your password to continue";

export const PROTOCOL = process.env.NEXT_PUBLIC_PROTOCOL ? "http" : "https";
