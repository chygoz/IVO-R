"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  CheckCircle,
  ShieldAlert,
  KeyRound,
  SmartphoneNfc,
  UserRoundCog,
  RefreshCw,
  Lock,
} from "lucide-react";
import Image from "next/image";

interface SecurityFormValues {
  password: {
    current: string;
    new: string;
    confirm: string;
  };
  twoFactor: {
    enabled: boolean;
    method: "app" | "sms";
    phone?: string;
  };
  loginAlerts: boolean;
  sessionTimeout: number;
  apiAccess: boolean;
}

const formSchema = z.object({
  password: z
    .object({
      current: z.string().min(1, "Current password is required"),
      new: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
      confirm: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.new === data.confirm, {
      message: "Passwords do not match",
      path: ["confirm"],
    }),
  twoFactor: z.object({
    enabled: z.boolean(),
    method: z.enum(["app", "sms"]),
    phone: z.string().optional(),
  }),
  loginAlerts: z.boolean(),
  sessionTimeout: z.number().min(5).max(1440),
  apiAccess: z.boolean(),
});

export default function SecuritySettings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [qrCode] = useState("/api/placeholder/200/200");

  // Mock data for demo purposes
  const initialData = {
    password: {
      current: "",
      new: "",
      confirm: "",
    },
    twoFactor: {
      enabled: false,
      method: "app" as const,
      phone: "",
    },
    loginAlerts: true,
    sessionTimeout: 120,
    apiAccess: false,
  };

  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: SecurityFormValues) => {
    try {
      setIsSubmitting(true);

      // API call would go here
      console.log("Form submitted:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitting(false);

      // Reset password fields
      form.reset({
        ...data,
        password: {
          current: "",
          new: "",
          confirm: "",
        },
      });
    } catch (error) {
      console.error("Error saving security settings:", error);
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async () => {
    const passwordData = form.getValues("password");

    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      form.setError("password.current", {
        message: "All password fields are required",
      });
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      form.setError("password.confirm", { message: "Passwords do not match" });
      return;
    }

    try {
      setIsChangingPassword(true);

      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Reset password fields
      form.setValue("password.current", "");
      form.setValue("password.new", "");
      form.setValue("password.confirm", "");

      setIsChangingPassword(false);
    } catch (error) {
      console.error("Error changing password:", error);
      setIsChangingPassword(false);
    }
  };

  const setupTwoFactor = () => {
    // In a real app, this would trigger 2FA setup flow
    setIsSetupComplete(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Security Settings</h2>
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="gap-2"
        >
          {isSubmitting ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
        <ShieldAlert className="h-4 w-4" />
        <AlertDescription>
          Protect your account with strong security practices.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="password" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 w-full md:w-auto">
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <TabsContent value="password" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex flex-col space-y-1.5">
                    <h3 className="text-lg font-semibold">Change Password</h3>
                    <p className="text-sm text-muted-foreground">
                      Update your account password
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="password.current"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your current password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="password.new"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter new password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password.confirm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm new password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <p className="text-sm mb-2">Password Requirements:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        At least 8 characters long
                      </li>
                      <li className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        At least one uppercase letter
                      </li>
                      <li className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        At least one lowercase letter
                      </li>
                      <li className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        At least one number
                      </li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                    className="gap-2"
                  >
                    {isChangingPassword ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <KeyRound className="h-4 w-4" />
                    )}
                    {isChangingPassword
                      ? "Changing Password..."
                      : "Change Password"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Form>
      </Tabs>

      <div className="flex justify-end pt-6">
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="gap-2"
        >
          {isSubmitting ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
