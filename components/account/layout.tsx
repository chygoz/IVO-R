import React from "react";
import AccountSidebar from "./sidebar";
import Container from "../ui/container";
import Header from "./header";

type AccountLayoutComponentProps = {
  children: React.ReactNode;
};

function AccountLayoutComponent({ children }: AccountLayoutComponentProps) {
  return (
    <Container className="pt-[var(--nav-height-mobile)] sm:pt-[var(--nav-height-tablet)]  lg:pt-[var(--nav-height-desktop)]">
      <Header />
      <div className="grid sm:grid-cols-4">
        <AccountSidebar />
        <div className="sm:col-span-3 py-[30px] px-8 sm:px-[80px]">
          {children}
        </div>
      </div>
    </Container>
  );
}

export default AccountLayoutComponent;
