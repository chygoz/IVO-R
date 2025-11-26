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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HiEye, HiEyeOff } from "react-icons/hi"; // Importing icons
import SuccessfulDialog from "./successful";

// Validation schema using Zod
const formSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  newpassword: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SecureAccountComponent() {
  const [open, setOpen] = useState(false); // Control modal state

  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility toggle
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      newpassword: "",
    },
  });

  const handleSubmit = (values: any) => {
    console.log("Form Submitted:", values);
  };

  return (
    <div className=" items-center min-h-screen">
      {/* Left Side - Signup Form */}
      <motion.div
        className="w-full lg:w-full flex items-center justify-center p-6"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-center mb-6">IVÓ </h2>

            <p className="text-xl font-bold text-center text-black mb-6">
              Secure your account
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                          />
                          <span
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                          >
                            {passwordVisible ? <HiEyeOff /> : <HiEye />}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newpassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                          />
                          <span
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                          >
                            {passwordVisible ? <HiEyeOff /> : <HiEye />}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  onClick={() => setOpen(true)}
                  type="submit"
                  className="w-full bg-primary"
                >
                  Proceed to Login
                </Button>

                {/* Success Dialog - Pass the open state and setter */}
                <SuccessfulDialog open={open} setOpen={setOpen} />
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
