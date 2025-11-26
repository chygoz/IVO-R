import React from "react";
import HeaderWrapper from "../header/header-wrapper";
import Footer from "../footer/footer";

type ResellerGeneralLayoutProps = {
  children: React.ReactNode;
};

function ResellerGeneralLayout({ children }: ResellerGeneralLayoutProps) {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <HeaderWrapper />

      <main
        className="overflow-hidden w-full flex-grow"
        style={{
          minHeight: "-webkit-fill-available",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {children}

        <Footer />
      </main>
    </div>
  );
}

export default ResellerGeneralLayout;
