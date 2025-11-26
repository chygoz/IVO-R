import React, { Suspense } from "react";

import TransactionTable from "./table";

async function TransactionTableMain() {
  return (
    <Suspense fallback={<div>...please wait</div>}>
      <TransactionTable transactions={[]} isPartner={false} />
    </Suspense>
  );
}

export default TransactionTableMain;
