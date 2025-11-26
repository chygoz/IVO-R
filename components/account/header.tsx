import React from "react";
import AccountMobileNav from "./mobile.nav";

function Header() {
  return (
    <div className="py-[26px] px-8 sm:px-[52px] border-b border-b-solid border-b-[#D1D1D1]">
      <div className="flex items-center">
        <h4>Home</h4>
        <div className="ml-auto block sm:hidden">
          <AccountMobileNav />
        </div>
      </div>
    </div>
  );
}

export default Header;
