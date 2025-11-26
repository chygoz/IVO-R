"use client";

import { useState } from "react";
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
import { toast } from "sonner";
import ButtonText from "@/components/ui/buttonText";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import sigUpPic from "@/app/assets/signupphoto.png";

import { PasswordInput } from "@/components/ui/password-input";
import { usePathname, useRouter } from "next/navigation";
import { doCredentialLogin } from "@/actions/login";

// Validation schema using Zod
const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  gender: z.string(),
  age: z.number().min(1, "Age is required").max(100, "Enter a valid age"),
  phoneNumber: z.string().min(10, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignupComponent() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
      age: 0,
      phoneNumber: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData()
    formData.append("firstName", values.firstName)
    formData.append("lastname", values.lastName)
    formData.append("gender", values.gender)
    // formData.append("age", values.age)
    formData.append("phoneNumber", values.phoneNumber)
    formData.append("email", values.email)
    formData.append("password", values.password)

    setIsLoading(true);
    const result = await doCredentialLogin(formData, "create");
    if (result.error) {
      setError(result.error || "Something went wrong");
    } else {
      router.push(`/admin/auth/plans-pricing}`);
      console.log("Form Submitted:", formData);
    }
    setIsLoading(false)
  };

  

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Signup Form */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-6"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="w-full  h-full shadow-lg">
          <CardContent className="px-2 sm:px-24 py-24">
            <h2 className="text-2xl font-bold text-start mb-24">
              IVÓ Reseller Program
            </h2>

            <h3 className="text-2xl font-bold text-start mb-2">Hi there! 👋</h3>

            <p className="text-xl font-bold text-start text-[#555A65] mb-6">
              Get started with your free account today.
            </p>

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
                          placeholder="Type your email here"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex space-x-4 justify-between items-center">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex space-x-4 justify-between items-center">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full px-4 py-2 border border-gray-400 rounded-md"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="What's your age?" {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}

                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="123-456-7890"
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

                  <ButtonText loading={isLoading}>Create Account</ButtonText>
                </Button>


                {/* Separator with 'or' text */}
              </form>
            </Form>

            <p className="text-start text-sm mt-4">
              Already have an account?{" "}
              <Link
                href="/admin/auth/signin"
                className="text-primary font-bold"
              >
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Right Side - Image */}
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
