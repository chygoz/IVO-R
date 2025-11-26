import React from "react";
import PageWrapper from "../ui/page-wrapper";
import TransactionTable from "./table";
import WalletSwitcher from "./wallet-switcher";
import QuickActions from "./quick-actions";
import { DVA } from "@/actions/accounts/utils";

type AccountsComponentProps = {
  currency: string;
  dva: DVA;
};

async function AccountsComponent({ currency, dva }: AccountsComponentProps) {
  return (
    <PageWrapper>
      <h1 className="text-2xl font-semibold">Wallet & Account</h1>
      <div className="flex flex-col gap-5">
        <WalletSwitcher currency={currency} />
        <QuickActions dva={dva} />
      </div>
      <div className="mt-10">
        <TransactionTable />
      </div>
    </PageWrapper>
  );
}

export default AccountsComponent;
