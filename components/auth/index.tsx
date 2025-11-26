import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./forms/login";
import CreateAccountForm from "./forms/create-account";
import { cn } from "@/lib/utils";

type AuthFormProps = {
  mode?: "white" | "black";
};

function AuthForm({ mode = "black" }: AuthFormProps) {
  return (
    <Tabs defaultValue="login" className="w-full mt-20">
      <TabsList className="grid w-full grid-cols-2 bg-transparent">
        <TabsTrigger
          className={cn(
            "data-[state=active]:bg-transparent rounded-none pb-4 transition-[border] duration-150 ease-in-out data-[state=active]:border-b-2 data-[state=active]:border-b-solid",
            mode === "black"
              ? "data-[state=active]:border-b-white text-gray-500 data-[state=active]:text-white"
              : "data-[state=active]:border-b-black"
          )}
          value="login"
        >
          SIGN IN
        </TabsTrigger>
        <TabsTrigger
          className={cn(
            "data-[state=active]:bg-transparent rounded-none pb-4 transition-[border] duration-150 ease-in-out data-[state=active]:border-b-2 data-[state=active]:border-b-solid",
            mode === "black"
              ? "data-[state=active]:border-b-white text-gray-500 data-[state=active]:text-white"
              : "data-[state=active]:border-b-black"
          )}
          value="account"
        >
          CREATE ACCOUNT
        </TabsTrigger>
      </TabsList>
      <TabsContent className="py-4" value="login">
        <LoginForm mode={mode} />
      </TabsContent>
      <TabsContent value="account">
        <CreateAccountForm />
      </TabsContent>
    </Tabs>
  );
}

export default AuthForm;
