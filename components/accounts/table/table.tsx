"use client";
import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EmptyTable from "@/components/ui/empty-table";
import { Card } from "@/components/ui/card";

type TransactionTableProps = {
  transactions: any[];
  isPartner: boolean;
};

function TransactionTable({ transactions, isPartner }: TransactionTableProps) {
  const [timeRange, setTimeRange] = React.useState("90d");
  return (
    <Card className="p-4">
      <div className="flex items-center mb-6">
        <h3 className="font-bold text-text text-[28px] ">
          Transaction History
        </h3>
        <div className="ml-auto flex flex-col sm:flex-row items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {transactions.length ? (
        <></>
      ) : (
        <EmptyTable
          title="No Transactions Yet"
          subTitle="You haven’t made any transactions yet. Once you do, they’ll show up here."
        ></EmptyTable>
      )}
    </Card>
  );
}

export default TransactionTable;
