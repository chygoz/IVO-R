"use client";
import React from "react";

import NewWithdrawalForm from "./form";
import { Session } from "next-auth";
import PageWrapper from "@/components/ui/page-wrapper";
import GoBackButton from "@/components/goBackButton";

function NewWithdrawAccount({
  session,
  banks,
}: {
  session: Session;
  banks: {
    id: number;
    code: string;
    name: string;
  }[];
}) {
  return (
    <PageWrapper>
      <div className="flex flex-col justify-center max-w-[400px] mx-auto h-full relative min-h-[80vh]">
        <GoBackButton className="mb-5 bg-gray-100 text-black flex items-center gap-2 w-fit">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.5 8H2.5M2.5 8L7 3.5M2.5 8L7 12.5"
              stroke="#5E718D"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </GoBackButton>
        <h2 className="text-xl font-semibold">
          Setup your Withdrawal Bank Details
        </h2>
        <p className="text-[#A5A5A5] mb-4">Provide the following information</p>

        <NewWithdrawalForm banks={banks} session={session} />
      </div>
    </PageWrapper>
  );
}

export default NewWithdrawAccount;
