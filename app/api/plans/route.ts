import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const plansData = {
    success: true,
    message: "Plans retrieved successfully",
    data: {
      plans: [
        {
          _id: "67ff738640c2b780b193c2c3",
          name: "Basic Reseller Plan",
          code: "BASIC",
          price: 250000,
          currency: "NGN",
          billingCycle: "yearly",
          features: {
            whiteLabeling: {
              type: "boolean",
              value: true,
              description: "White-label e-commerce storefront",
            },
            productLimit: {
              type: "number",
              value: 15,
              description:
                "Limited Number of products to sell (Capped at 15 items)",
            },
            collectionLimit: {
              type: "number",
              value: 15,
              description:
                "Limited number of IVO collections to resell from (Capped at 15 collections)",
            },
            piecesPerCollectionLimit: {
              type: "number",
              value: 10,
              description: "10 pieces per selection",
            },
            salesReporting: {
              type: "boolean",
              value: true,
              description: "Sales Reports & Analytics",
            },
            customerSupport: {
              type: "boolean",
              value: true,
              description: "24/7 customer service support",
            },
            paymentCurrencies: {
              type: "array",
              value: ["NGN", "USD"],
              description: "Accept payments in Naira and US dollars",
            },
            settlementCurrencies: {
              type: "array",
              value: ["NGN"],
              description: "Settlements only in Naira",
            },
          },
          additionalFeatures: {},
          metadata: {
            displayOrder: 1,
            recommendedFor: "Small businesses and new resellers",
            popularChoice: false,
          },
          isActive: true,
          __v: 0,
          createdAt: "2025-04-16T09:08:22.243Z",
          updatedAt: "2025-04-16T09:08:22.243Z",
        },
        {
          _id: "67ff738640c2b780b193c2c4",
          name: "Pro Reseller Plan",
          code: "PRO",
          price: 500000,
          currency: "NGN",
          billingCycle: "yearly",
          features: {
            whiteLabeling: {
              type: "boolean",
              value: true,
              description: "White-label e-commerce storefront",
            },
            productLimit: {
              type: "number",
              value: null,
              description: "Unlimited number of products to sell",
            },
            collectionLimit: {
              type: "number",
              value: null,
              description: "Unlimited number of IVO collections to resell",
            },
            piecesPerCollectionLimit: {
              type: "number",
              value: null,
              description: "Unlimited pieces per collection",
            },
            salesReporting: {
              type: "boolean",
              value: true,
              description: "Sales Reports & Analytics",
            },
            customerSupport: {
              type: "boolean",
              value: true,
              description: "24/7 customer support",
            },
            paymentCurrencies: {
              type: "array",
              value: ["NGN", "USD"],
              description: "Accept payments in Naira and US dollars",
            },
            settlementCurrencies: {
              type: "array",
              value: ["NGN"],
              description: "Settlements only in Naira",
            },
          },
          additionalFeatures: {},
          metadata: {
            displayOrder: 2,
            recommendedFor: "Growing businesses and established resellers",
            popularChoice: true,
          },
          isActive: true,
          __v: 0,
          createdAt: "2025-04-16T09:08:22.243Z",
          updatedAt: "2025-04-16T09:08:22.243Z",
        },
      ],
      total: 2,
      totalPages: null,
    },
  };

  return NextResponse.json(plansData);
}
