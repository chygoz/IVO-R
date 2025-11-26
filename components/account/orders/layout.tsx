import React from "react";
import OrderMenu from "./menu";
import AccountPageHeader from "../page-header";

type OrderLayoutComponentProps = {
  children: React.ReactNode;
};

function OrderLayoutComponent({ children }: OrderLayoutComponentProps) {
  return (
    <div>
      <AccountPageHeader>
        <OrderMenu />
      </AccountPageHeader>
      {children}
    </div>
  );
}

export default OrderLayoutComponent;
