export interface ITransaction {
  referenceId: string;
  user: {
    email: string;
    name: string;
  };
  orderId: string;
  amount: string;
  status?: string;
  transactionDate: Date;
}
