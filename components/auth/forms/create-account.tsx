"use client";
import React, { useState } from "react";
import { doCredentialLogin } from "@/actions/login";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ErrorAlert from "@/components/ui/error-alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import ButtonText from "@/components/ui/buttonText";

function CreateAccountForm() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const redirect = pathname.includes("auth") ? "/store" : pathname;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIsLoading(true);
    const result = await doCredentialLogin(formData, "create");
    if (result?.error) {
      setError(result.error || "Something went wrong");
    } else {
      toast.success("Logged in successfully");
    }
    setIsLoading(false);
  }

  return (
    <>
      {error && <ErrorAlert>{error}</ErrorAlert>}
      <form onSubmit={onSubmit} className="flex flex-col gap-4 py-4 w-full">
        <div className=" grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 w-full">
            <Label className="text-xs">First Name</Label>
            <Input
              required
              name="firstName"
              id="firstName"
              placeholder="Enter your first name"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label className="text-xs">Last Name</Label>

            <Input
              required
              name="lastName"
              id="lastName"
              placeholder="Enter your last name"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label className=" text-xs">Email</Label>
          <Input
            required
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email address"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-xs">Phone Number</Label>
          <Input
            required
            name="phone"
            id="phone"
            placeholder="Enter your phone number"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-xs">Password</Label>
          <PasswordInput
            required
            name="password"
            id="password"
            type="password"
            placeholder="Enter your password"
          />
        </div>
        <Button
          disabled={isLoading}
          className="bg-primary-500 text-white"
          type="submit"
        >
          <ButtonText loading={isLoading}>Sign up</ButtonText>
        </Button>
      </form>
    </>
  );
}

export default CreateAccountForm;
