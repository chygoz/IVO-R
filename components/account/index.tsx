import React from "react";
import PageHeader from "../common/page-header";
import { auth } from "@/auth";
import { Separator } from "../ui/separator";
import { Card } from "../ui/card";

async function AccountComponent() {
  const session = await auth();
  return (
    <div className="">
      <div className="flex">
        <div className="capitalize font-bold text-2xl">
          Welcome, {session?.user.name}
        </div>
        <button className="ml-auto text-primary-500 font-bold">
          Delete Account
        </button>
      </div>
      <Separator className="my-4" />
      <Card className="md:col-span-5 mt-8">
        <div className="flex bg-[#F8F8F8] p-5">
          <div className="font-bold">Personal Information</div>
          <button className="ml-auto  font-bold">Edit</button>
        </div>
        <ul className="p-5">
          <li className="capitalize">
            <span className="font-bold">Name:</span>{" "}
            <span className="capitalize">{session?.user.name}</span>
          </li>
          <li>
            <span className="font-bold">Contact:</span> {session?.user.email}
          </li>
        </ul>
      </Card>
    </div>
  );
}

export default AccountComponent;
