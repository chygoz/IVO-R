"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import sigUpPic from "@/app/assets/signupphoto.png";
import { PasswordInput } from "@/components/ui/password-input";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { doCredentialLogin } from "@/actions/login";
import { toast } from "sonner";
import ButtonText from "@/components/ui/buttonText";
import ErrorAlert from "@/components/ui/error-alert";
import ChangePassword from "./change-password";
import { NEEDS_PASSWORDS_CHANGE } from "@/constants";
import Link from "next/link";

// Validation schema using Zod
const formSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

export default function SignInComponent({ from }: { from?: string }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");
  const redirect = from ? from : pathname;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    setIsLoading(true);
    const result = await doCredentialLogin(formData);
    if (result.error) {
      setError(result.error || "Something went wrong");
    } else {
      router.push(`/callback${from ? `?from=${from}` : ""}`);
      toast.success("Logged in successfully");
    }

    setIsLoading(false);
  }

  return (
    <div className="flex sm:min-h-screen">
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-6"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="w-full h-full shadow-lg">
          <CardContent className="px-2 py-24 sm:px-24">
            <h2 className="text-2xl font-bold text-start mb-24">
              IVÓ Reseller Program
            </h2>
            <h3 className="text-2xl font-bold text-start mb-2">
              Welcome back! 👋
            </h3>
            <p className="text-xl font-bold text-start text-[#555A65] mb-6">
              Login to your account.
            </p>
            {error && <ErrorAlert>{error}</ErrorAlert>}
            {error === NEEDS_PASSWORDS_CHANGE ? (
              <ChangePassword
                email={form.getValues("email") || ""}
                oldPassword={form.getValues("password") || ""}
              />
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="johndoe@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => <PasswordInput {...field} />}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-primary text-white font-semibold py-3"
                    disabled={isLoading}
                  >
                    <ButtonText loading={isLoading}>{isLoading ? "Logging..." : "Log In"}</ButtonText>
                  </Button>
                </form>
              </Form>
            )}

            <div className="flex justify-center">
              <Button className="text-center" variant="link">
                <Link href="/">Go back</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="hidden lg:flex w-1/2 bg-dashboardBg items-center justify-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src={sigUpPic}
          alt="Signup"
          className="w-full h-full object-cover"
          width={600}
          height={800}
        />
      </motion.div>
    </div>
  );
}
