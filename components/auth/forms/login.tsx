"use client";
import React, { useState } from "react";
import { doCredentialLogin } from "@/actions/login";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ButtonText from "@/components/ui/buttonText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import ErrorAlert from "@/components/ui/error-alert";
type LoginFormProps = {
  mode?: "white" | "black";
};
function LoginForm({ mode = "black" }: LoginFormProps) {
  const [error, setError] = useState("");
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  // const redirect = pathname.includes("auth") ? "/store" : pathname;
  const router = useRouter()
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/"; // redirect to initial route after successful login

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    setIsLoading(true);

    const result = await doCredentialLogin(formData);
    if (result?.error) {
      setError(result.error || "Something went wrong");
    } else {
      router.replace(redirect)
      toast.success("Logged in successfully");
    }
    setIsLoading(false);
  }

  return (
    <>
      {error && <ErrorAlert>{error}</ErrorAlert>}

      <form onSubmit={onSubmit} className="flex flex-col gap-4 py-4 w-full">
        <div className="flex flex-col gap-2 w-full">
          <Label className="text-xs">Email</Label>
          <Input
            type="email"
            required
            name="email"
            id="email"
            placeholder="Enter your email address"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Label className="text-xs">Password</Label>
          <PasswordInput
            type="password"
            required
            placeholder="Enter your password"
            name="password"
            id="password"
          />
        </div>
        <Button
          disabled={isLoading}
          className={cn(
            mode === "black"
              ? "bg-white text-primary-500"
              : "bg-primary-500 text-white ",
            "p-3  capitalize w-full"
          )}
          type="submit"
        >
          <ButtonText loading={isLoading}>Sign in</ButtonText>
        </Button>
      </form>
    </>
  );
}

export default LoginForm;
