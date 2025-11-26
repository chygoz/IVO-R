import { headers } from "next/headers";

export type ResellerInfo = {
  id: string | null;
  name: string | null;
  subdomain: string | null;
  isCustomDomain: boolean;
};

export async function getCurrentReseller(): Promise<ResellerInfo> {
  const headersList = await headers();

  console.log("header", headersList.get("x-reseller-id"));

  return {
    id: headersList.get("x-reseller-id"),
    name: headersList.get("x-reseller-name"),
    subdomain: headersList.get("x-reseller-subdomain"),
    isCustomDomain: headersList.get("x-reseller-custom-domain") === "true",
  };
}

export const THEPLANPRICE = [
  {
    plan: "Basic",
    subplan: "Best for upto 200 customers ",
    price: "$300",
    renewal: "Renews Oct. 2025 for N183.3/mo (N200,000 total)",
    benefit: [
      "White-label ecommerce storefront",
      "Credit card processing",
      "24/7 support",
      "Sales and commission reports",
      "Standard buy rates, up to 20% off retail",
    ],
  },
  {
    plan: "Pro Reseller",
    subplan: "Best for unlimited customers ",
    price: "$500",
    renewal: "Renews Oct. 2025 for N187.3k/mo (N3,600,000 total)",
    benefit: [
      "White-label ecommerce storefront",
      "Credit card processing",
      "24/7 support",
      "Sales and commission reports",
      "Standard buy rates, up to 20% off retail",
    ],
  },
];
