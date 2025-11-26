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
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, RefreshCw, Bell } from "lucide-react";

interface NotificationsFormValues {
  email: {
    newOrder: boolean;
    lowStock: boolean;
    customerMessages: boolean;
    paymentReceipts: boolean;
    marketingUpdates: boolean;
  };
  push: {
    newOrder: boolean;
    lowStock: boolean;
    customerMessages: boolean;
  };
  sms: {
    enabled: boolean;
    phoneNumber: string;
    newOrder: boolean;
    importantAlerts: boolean;
  };
}

const formSchema = z.object({
  email: z.object({
    newOrder: z.boolean(),
    lowStock: z.boolean(),
    customerMessages: z.boolean(),
    paymentReceipts: z.boolean(),
    marketingUpdates: z.boolean(),
  }),
  push: z.object({
    newOrder: z.boolean(),
    lowStock: z.boolean(),
    customerMessages: z.boolean(),
  }),
  sms: z.object({
    enabled: z.boolean(),
    phoneNumber: z.string().optional(),
    newOrder: z.boolean(),
    importantAlerts: z.boolean(),
  }),
});

export default function NotificationsSettings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Mock data for demo purposes
  const initialData = {
    email: {
      newOrder: true,
      lowStock: true,
      customerMessages: true,
      paymentReceipts: true,
      marketingUpdates: false,
    },
    push: {
      newOrder: true,
      lowStock: false,
      customerMessages: true,
    },
    sms: {
      enabled: false,
      phoneNumber: "",
      newOrder: false,
      importantAlerts: false,
    },
  };

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  // When form values change, update the isDirty state
  const onFormChange = () => {
    setIsDirty(true);
  };

  form.watch(onFormChange);

  const onSubmit = async (data: NotificationsFormValues) => {
    try {
      setIsSubmitting(true);

      // API call would go here
      console.log("Form submitted:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsDirty(false);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error saving notification settings:", error);
      setIsSubmitting(false);
    }
  };

  const smsEnabled = form.watch("sms.enabled");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Notification Settings</h2>
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          disabled={!isDirty || isSubmitting}
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
        <Bell className="h-4 w-4" />
        <AlertDescription>
          Configure which notifications you receive about your store activity.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 w-full md:w-auto">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="push">Push</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <TabsContent value="email" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex flex-col space-y-1.5">
                    <h3 className="text-lg font-semibold">
                      Email Notifications
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Configure which emails you receive about your store
                      activity.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email.newOrder"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              New Order Notifications
                            </FormLabel>
                            <FormDescription>
                              Receive an email when a new order is placed.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email.lowStock"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Low Stock Alerts
                            </FormLabel>
                            <FormDescription>
                              Get notified when products are running low.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email.customerMessages"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Customer Messages
                            </FormLabel>
                            <FormDescription>
                              Receive emails when customers send you messages.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email.paymentReceipts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Payment Receipts
                            </FormLabel>
                            <FormDescription>
                              Receive copies of customer payment receipts.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email.marketingUpdates"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Marketing Updates
                            </FormLabel>
                            <FormDescription>
                              Receive tips, product updates, and other marketing
                              emails.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="push" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex flex-col space-y-1.5">
                    <h3 className="text-lg font-semibold">
                      Push Notifications
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Configure browser push notifications for real-time alerts.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="push.newOrder"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              New Order Alerts
                            </FormLabel>
                            <FormDescription>
                              Get instant push notifications for new orders.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="push.lowStock"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Low Stock Warnings
                            </FormLabel>
                            <FormDescription>
                              Be notified immediately when inventory is running
                              low.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="push.customerMessages"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Customer Messages
                            </FormLabel>
                            <FormDescription>
                              Get push alerts when customers message you.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sms" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex flex-col space-y-1.5">
                    <h3 className="text-lg font-semibold">SMS Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Get text messages for critical store updates.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="sms.enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Enable SMS Notifications
                          </FormLabel>
                          <FormDescription>
                            Receive important updates via text message.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {smsEnabled && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="sms.phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="+1 (555) 123-4567"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Enter your phone number with country code.
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <Separator />

                      <FormField
                        control={form.control}
                        name="sms.newOrder"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                New Order SMS
                              </FormLabel>
                              <FormDescription>
                                Get text alerts for new orders.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sms.importantAlerts"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Critical Alerts
                              </FormLabel>
                              <FormDescription>
                                Receive SMS for critical issues like payment
                                failures.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
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
          disabled={!isDirty || isSubmitting}
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
