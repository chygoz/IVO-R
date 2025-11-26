"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Session } from "next-auth";
import dayjs from "dayjs";
import { formatMoney } from "@/utils/money";
import ContinueShopping from "@/components/cart/ContinueShopping";
import { ITransaction } from "@/types/transaction";

type PaymentTableProps = {
  transactions: ITransaction[];
};

function PaymentTable({ transactions }: PaymentTableProps) {
  if (transactions.length === 0)
    return (
      <div className="flex flex-col gap-4 items-center">
        <p className="text-center">No transactions found</p>
        <ContinueShopping />
      </div>
    );
  return (
    <>
      <Table className="hidden md:table">
        <TableHeader className="bg-gray-300  text-black">
          <TableRow>
            <TableHead className="text-text-black">Payment ID</TableHead>
            <TableHead className="text-text-black">Payment Date</TableHead>
            <TableHead className="text-text-black">Order ID</TableHead>
            <TableHead className="text-text-black">Amount</TableHead>
            <TableHead className="text-text-black">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.referenceId}>
              <TableCell className="font-medium">
                {transaction.referenceId}
              </TableCell>
              <TableCell>
                {dayjs(transaction.transactionDate).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell className="capitalize">
                {transaction.orderId}
              </TableCell>
              <TableCell>
                N{formatMoney(parseFloat(transaction.amount))}
              </TableCell>
              <TableCell>
                <Badge className="capitalize" variant="success">
                  {transaction.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ul className="flex md:hidden flex-col gap-4">
        {transactions.map((transaction) => (
          <li
            key={transaction.referenceId}
            className="flex flex-col gap-2 md:hidden p-4 bg-gray-100"
          >
            <div className="flex justify-between items-center">
              <p className="font-medium">
                Payment ID: {transaction.referenceId}
              </p>
              <Badge className="capitalize" variant="success">
                {transaction.status}
              </Badge>
            </div>
            <p>
              Payment Date:{" "}
              {dayjs(transaction.transactionDate).format("DD/MM/YYYY")}
            </p>
            <p>Order ID: {transaction.orderId}</p>
            <p className="text-lg font-bold">
              Amount: N{formatMoney(parseFloat(transaction.amount))}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}

export default PaymentTable;
