import React from "react";

import { Session } from "next-auth";
import PaymentTable from "./table";
import AccountPageHeader from "../page-header";

type PaymentHistoryComponentProps = {
  session: Session | null;
};

function PaymentHistoryComponent({ session }: PaymentHistoryComponentProps) {
  return (
    <div>
      <AccountPageHeader>
        <div className="text-xl">Transaction History</div>
      </AccountPageHeader>
      <PaymentTable transactions={[]} />
    </div>
  );
}

export default PaymentHistoryComponent;
