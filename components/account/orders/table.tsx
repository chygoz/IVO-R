import React from "react";
import ContinueShopping from "@/components/cart/ContinueShopping";
import { IOrder } from "@/types/orders";
import OrderCard from "./order.card";
type OrderTableProps = {
  orders: IOrder[];
};
function OrderTable({ orders }: OrderTableProps) {
  if (orders.length === 0)
    return (
      <div className="flex flex-col gap-4 items-center">
        <p className="text-center">No orders found</p>
        <ContinueShopping />
      </div>
    );

  return (
    <ul className="flex flex-col gap-4">
      {orders.map((order) => (
        <li key={order.orderId}>
          <OrderCard order={order} />
        </li>
      ))}
    </ul>
  );
}

export default OrderTable;
