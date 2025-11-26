"use client";
import React from "react";
import Container from "@/components/ui/container";
import PageHeader from "@/components/common/page-header";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function TrackOrderComponent() {
  const [orderID, setOrderID] = React.useState("INV001"); // [1
  const router = useRouter();
  return (
    <Container>
      <PageHeader pageHeader="Track an Order" />
      <div className="mt-8">
        <input
          type="text"
          value={orderID}
          onChange={(e) => setOrderID(e.target.value)}
          placeholder="Enter your order ID"
          className="w-full border border-gray-300 p-2 rounded-md"
        />
        <Button
          onClick={() => {
            if (orderID) {
              router.push(`/account/orders/${orderID}`);
            }
          }}
          className="mt-4 bg-black text-white p-2 rounded-md"
        >
          Track Order
        </Button>
      </div>
    </Container>
  );
}

export default TrackOrderComponent;
