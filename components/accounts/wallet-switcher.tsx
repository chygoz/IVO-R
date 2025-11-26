import React, { Suspense } from "react";
import SwitchMenu from "./switch-menu";
import WalletSummary from "./wallet-summary";
import { getWallets } from "@/actions/accounts";

type WalletSummaryProps = {
  currency?: string;
};

async function WalletSwitcher({ currency }: WalletSummaryProps) {
  const response = await getWallets();
  const wallets = response.data.wallets;

  return (
    <div>
      <div className="flex items-center justify-between mt-5">
        <h3 className="text-xl font-semibold">Overview</h3>
        <SwitchMenu currency={currency} />
      </div>
      <Suspense fallback={<div>....please wait</div>}>
        <WalletSummary wallets={wallets} currency={currency} />
      </Suspense>
    </div>
  );
}

export default WalletSwitcher;
