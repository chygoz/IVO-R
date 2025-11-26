import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const paymentsData = {
    success: true,
    message: "Payments retrieved successfully",
    data: {
      payments: [
        {
          id: "pay_123456",
          invoiceNumber: "INV-2025-001",
          date: "2025-04-26T08:15:32.324Z",
          amount: 0,
          currency: "NGN",
          status: "paid",
          paymentMethod: "Promotional",
          transactionId: "txn_free_001",
          planName: "Beneficiary Reseller Plan",
          periodStart: "2025-04-26T13:28:45.324Z",
          periodEnd: "2026-04-26T13:28:45.324Z",
        },
        {
          id: "pay_123455",
          invoiceNumber: "INV-2024-052",
          date: "2024-10-15T10:22:18.324Z",
          amount: 500000,
          currency: "NGN",
          status: "paid",
          paymentMethod: "Card",
          transactionId: "txn_card_052",
          planName: "Pro Reseller Plan",
          periodStart: "2024-10-15T00:00:00.000Z",
          periodEnd: "2025-04-15T00:00:00.000Z",
        },
        {
          id: "pay_123454",
          invoiceNumber: "INV-2024-038",
          date: "2024-04-15T14:05:44.324Z",
          amount: 250000,
          currency: "NGN",
          status: "paid",
          paymentMethod: "Bank Transfer",
          transactionId: "txn_bank_038",
          planName: "Basic Reseller Plan",
          periodStart: "2024-04-15T00:00:00.000Z",
          periodEnd: "2024-10-15T00:00:00.000Z",
        },
      ],
      total: 3,
      totalPages: 1,
    },
  };

  return NextResponse.json(paymentsData);
}
