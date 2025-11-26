import React from "react";
import { Separator } from "../ui/separator";

type AccountPageHeaderProps = {
  children: React.ReactNode;
};

function AccountPageHeader({ children }: AccountPageHeaderProps) {
  return (
    <div>
      <div className="flex">{children}</div>
      <Separator className="my-4" />
    </div>
  );
}

export default AccountPageHeader;
