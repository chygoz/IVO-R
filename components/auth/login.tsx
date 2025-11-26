import React from "react";
import Container from "../ui/container";
import SigninForm from "./forms/login";
import { Card } from "../ui/card";
import Link from "next/link";

type SigninComponentProps = {
  mode: "white" | "black";
};

export default function SigninComponent({ mode }: SigninComponentProps) {
  return (
    <Container className="px-4 md:px-8 py-8 pt-[126px] min-h-[400px] w-full flex flex-col justify-center">
      <Card className="px-4 md:px-8 md:max-w-lg w-full md:mx-auto py-4 border border-solid  border-[#D1D1D1] rounded-[20px] flex flex-col items-center gap-2 justify-center">
        <svg
          width="41"
          height="24"
          viewBox="0 0 41 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.97301 6.04545V23.5H0.28267V6.04545H3.97301ZM10.1626 6.04545L14.3814 19.3068H14.5433L18.7706 6.04545H22.8615L16.8445 23.5H12.0888L6.06321 6.04545H10.1626ZM40.0178 14.7727C40.0178 16.6761 39.657 18.2955 38.9354 19.6307C38.2195 20.9659 37.2422 21.9858 36.0036 22.6903C34.7706 23.3892 33.3842 23.7386 31.8445 23.7386C30.2933 23.7386 28.9013 23.3864 27.6683 22.6818C26.4354 21.9773 25.4609 20.9574 24.745 19.6222C24.0291 18.2869 23.6712 16.6705 23.6712 14.7727C23.6712 12.8693 24.0291 11.25 24.745 9.91477C25.4609 8.57955 26.4354 7.5625 27.6683 6.86364C28.9013 6.15909 30.2933 5.80682 31.8445 5.80682C33.3842 5.80682 34.7706 6.15909 36.0036 6.86364C37.2422 7.5625 38.2195 8.57955 38.9354 9.91477C39.657 11.25 40.0178 12.8693 40.0178 14.7727ZM36.2763 14.7727C36.2763 13.5398 36.0916 12.5 35.7223 11.6534C35.3587 10.8068 34.8445 10.1648 34.1797 9.72727C33.5149 9.28977 32.7365 9.07102 31.8445 9.07102C30.9524 9.07102 30.174 9.28977 29.5092 9.72727C28.8445 10.1648 28.3274 10.8068 27.9581 11.6534C27.5945 12.5 27.4126 13.5398 27.4126 14.7727C27.4126 16.0057 27.5945 17.0455 27.9581 17.892C28.3274 18.7386 28.8445 19.3807 29.5092 19.8182C30.174 20.2557 30.9524 20.4744 31.8445 20.4744C32.7365 20.4744 33.5149 20.2557 34.1797 19.8182C34.8445 19.3807 35.3587 18.7386 35.7223 17.892C36.0916 17.0455 36.2763 16.0057 36.2763 14.7727ZM30.5405 4.35795L32.3473 0.480114H35.7053L33.1058 4.35795H30.5405Z"
            fill="#20483F"
          />
        </svg>

        <h1 className="font-bold  text-xl">Existing Customer</h1>
        <p>Sign in your IVÓ E-commerce account</p>
        <SigninForm mode={mode} />
        <p className="text-left w-full">
          Don’t have an account?{" "}
          <Link className="text-primary-500" href="/auth/signup">
            Sign Up
          </Link>
        </p>
      </Card>
    </Container>
  );
}
