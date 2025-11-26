import { DefaultSession } from "next-auth";
import { AuthUser } from "./user";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "customer" | "seller";
      token: string;
      cartId?: string;
      businessId?: string;
      businessKey?: string;
    } & DefaultSession["user"];
  }

  interface User extends AuthUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "customer" | "seller";
    token: string;
    cartId?: string;
    businessId?: string;
    businessKey?: string;
  }
}
