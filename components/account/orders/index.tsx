import React from "react";
import OrderTable from "./table";
import { IOrder } from "@/types/orders";
type OrdersComponentProps = {
  orders: IOrder[];
};
function OrdersComponent({ orders }: OrdersComponentProps) {
  return <OrderTable orders={orders} />;
}

export default OrdersComponent;
