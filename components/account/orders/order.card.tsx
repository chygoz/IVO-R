import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IOrder } from "@/types/orders";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import CartItemOrder from "./item";

type OrderCardProps = {
  order: IOrder;
};
function OrderCard({ order }: OrderCardProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#F8F8F8] px-4 sm:px-[31px] py-6">
        <span>
          Order Date: {dayjs(order.orderDate).format("YYYY-MM-DD HH:mm")}
        </span>
        <span>
          Order No: <span className="uppercase">{order.orderId}</span>
        </span>
        <button className="bg-white p-2">Cancel</button>
      </div>
      <CartItemOrder order={order} />
      <div className="flex justify-end">
        <Button
          asChild
          variant="outline"
          className="border-primary-500 hover:bg-primary-500 hover:text-white"
        >
          <Link href={`/account/orders/${order.orderId}`} className="flex">
            View Order
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default OrderCard;
