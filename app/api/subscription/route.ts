import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const subscriptionData = {
    success: true,
    message: "Subscription retrieved successfully",
    data: {
      _id: "680cdf8d3abf8669b97b26e2",
      businessId: "67a4c4e827faeba79668acb5",
      planId: {
        _id: "680cdd7d504a684e8dcf0692",
        name: "Beneficiary Reseller Plan",
        code: "BEN",
        price: 0,
        currency: "NGN",
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
      },
      planCode: "BEN",
      storeName: "tmlabs",
      storeUrl: "tmlabs.resellerivo.com",
      status: "active",
      startDate: "2025-04-26T13:28:45.324Z",
      endDate: "2026-04-26T13:28:45.324Z",
      renewalDate: "2026-04-26T13:28:45.324Z",
      isAutoRenew: true,
      price: 0,
      currency: "NGN",
      payments: [],
      customFeatures: {},
      metadata: {},
      createdAt: "2025-04-26T13:28:45.325Z",
      updatedAt: "2025-04-26T13:28:45.325Z",
      __v: 0,
    },
  };

  return NextResponse.json(subscriptionData);
}
