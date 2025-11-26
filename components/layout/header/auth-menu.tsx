import SignInComponent from "@/components/auth/Signin.button";
import React from "react";
import AccountMenuCard from "@/components/common/accountMenuCard";
import { Session } from "next-auth";

interface AuthMenuProps {
  session: Session | null;
}

const AuthMenu = ({ session }: AuthMenuProps) => {
  return session?.user ? (
    <AccountMenuCard session={session} />
  ) : (
    <SignInComponent />
  );
};

export default AuthMenu;
