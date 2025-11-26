export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface PaymentGatewayRequest {
  amount: number;
  currency: string;
  customer: {
    name: string;
    email: string;
  };
  redirect_url: string;
}

export interface PaymentGatewayResponse {
  status: "success" | "error";
  data?: {
    payment_url: string;
  };
  message?: string;
  error?: string;
}

export interface PaymentStatus {
  processed: boolean;
  transactionRef?: string;
  status?: "successful" | "cancelled";
  transactionId?: string;
}
