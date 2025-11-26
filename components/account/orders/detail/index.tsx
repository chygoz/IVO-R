import Container from "@/components/ui/container";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TriveBreadcrumb } from "@/components/ui/trive_breadcrumb";
import { Badge } from "@/components/ui/badge";
import { IOrder } from "@/types/orders";
import dayjs from "dayjs";
import { formatMoney } from "@/utils/money";
import OrderHeaderDetails from "./order.header";
import CartItemOrder from "../item";

type OrderDetailComponentProps = {
  order: IOrder;
};

function OrderDetailComponent({ order }: OrderDetailComponentProps) {
  return (
    <div className=" flex flex-col gap-5">
      <OrderHeaderDetails order={order} />
      <CartItemOrder order={order} />
    </div>
  );
}

export default OrderDetailComponent;
