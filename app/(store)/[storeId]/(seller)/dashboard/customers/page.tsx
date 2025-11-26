import { Metadata } from "next";
import { CustomerList } from "@/components/customers";

export const metadata: Metadata = {
  title: "Customer Management",
  description: "Manage your customers and see their transaction history.",
};

export default function CustomersPage() {
  return (
    <div className="container py-10">
      <CustomerList />
    </div>
  );
}
