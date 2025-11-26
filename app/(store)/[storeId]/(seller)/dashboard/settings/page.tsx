"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, MapPin, AlertTriangle, Globe } from "lucide-react";

interface GeneralSettingsFormValues {
  storefront: {
    settings: {
      isEnabled: boolean;
      showPrices: boolean;
      allowGuestCheckout: boolean;
      requireLogin: boolean;
      showStock: boolean;
      currency: "USD" | "NGN";
      language: "en";
      timezone: string;
    };
  };
  shipping: {
    address: string;
    country: string;
    city: string;
    zipcode: string;
  };
  contact: {
    email: string;
    phone: string;
    socialMedia: {
      instagram: string;
      facebook: string;
      twitter: string;
    };
  };
}

const formSchema = z.object({
  storefront: z.object({
    settings: z.object({
      isEnabled: z.boolean(),
      showPrices: z.boolean(),
      allowGuestCheckout: z.boolean(),
      requireLogin: z.boolean(),
      showStock: z.boolean(),
      currency: z.enum(["USD", "NGN"]),
      language: z.string(),
      timezone: z.string(),
    }),
  }),
  shipping: z.object({
    address: z.string().min(5, "Address must be at least 5 characters"),
    country: z.string().min(2, "Country is required"),
    city: z.string().min(2, "City is required"),
    zipcode: z.string().min(2, "Zip/Postal code is required"),
  }),
  contact: z.object({
    email: z.string().email("Must be a valid email"),
    phone: z.string().min(5, "Phone number is required"),
    socialMedia: z.object({
      instagram: z.string().optional(),
      facebook: z.string().optional(),
      twitter: z.string().optional(),
    }),
  }),
});

const timezones = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },

  { value: "Africa/Lagos", label: "West Africa Time" },
];

export default function GeneralSettings() {
  const router = useRouter();
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for demo purposes - in production you'd fetch this from API
  const initialData = {
    storefront: {
      settings: {
        isEnabled: true,
        showPrices: true,
        allowGuestCheckout: true,
        requireLogin: false,
        showStock: true,
        currency: "USD" as const,
        language: "en",
        timezone: "UTC",
      },
    },
    shipping: {
      address: "123 Main Street",
      country: "United States",
      city: "New York",
      zipcode: "10001",
    },
    contact: {
      email: "contact@example.com",
      phone: "+1 (555) 123-4567",
      socialMedia: {
        instagram: "@storename",
        facebook: "storename",
        twitter: "@storename",
      },
    },
  };

  const form = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(formSchema),
    //@ts-expect-error
    defaultValues: initialData,
  });

  // When form values change, update the isDirty state
  useEffect(() => {
    const subscription = form.watch(() => {
      setIsDirty(true);
    });
    return () => subscription.unsubscribe();
    //eslint-disable-next-line
  }, [form.watch]);

  const onSubmit = async (data: GeneralSettingsFormValues) => {
    try {
      setIsSubmitting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message and reset dirty state
      setIsDirty(false);
      setIsSubmitting(false);

      // In production, you'd revalidate the data and redirect
      // router.refresh();
    } catch (error) {
      console.error("Error saving store settings:", error);
      setIsSubmitting(false);
    }
  };

  const storeEnabled = form.watch("storefront.settings.isEnabled");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">General Settings</h2>
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          disabled={!isDirty || isSubmitting}
          className="gap-2"
        >
          {isSubmitting ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      {!storeEnabled && (
        <Alert
          variant="warning"
          className="bg-amber-50 text-amber-800 border-amber-300"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your store is currently disabled. Customers won&apos;t be able to
            access it.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="store" className="w-full">
        <TabsList
          className="mb-6 flex w-full overflow-x-auto whitespace-nowrap scrollbar-hide gap-2 px-1"
          style={{
            scrollSnapType: "x mandatory",
            justifyContent: "flex-start",
          }}
        >
          <TabsTrigger
            className="flex-shrink-0 min-w-max scroll-snap-start"
            value="store"
          >
            Store Settings
          </TabsTrigger>
          <TabsTrigger
            className="flex-shrink-0 min-w-max scroll-snap-start"
            value="shipping"
          >
            Shipping & Location
          </TabsTrigger>
          <TabsTrigger
            className="flex-shrink-0 min-w-max scroll-snap-start"
            value="contact"
          >
            Contact Info
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <TabsContent value="store" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex flex-col space-y-1.5">
                    <h3 className="text-lg font-semibold">Store Visibility</h3>
                    <p className="text-sm text-muted-foreground">
                      Control your store&apos;s availability to customers
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="storefront.settings.isEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Enable Store
                          </FormLabel>
                          <FormDescription>
                            When disabled, your store will show a &quot;Coming
                            Soon&quot; page.
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

                  <Separator />

                  <div className="flex flex-col space-y-1.5">
                    <h3 className="text-lg font-semibold">Display Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure what information customers can see
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="storefront.settings.showPrices"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Show Product Prices
                            </FormLabel>
                            <FormDescription>
                              Display product prices on your storefront
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
                      name="storefront.settings.showStock"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Show Stock Information
                            </FormLabel>
                            <FormDescription>
                              Display product availability status
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

                  <Separator />

                  <div className="flex flex-col space-y-1.5">
                    <h3 className="text-lg font-semibold">Checkout Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure how customers can checkout
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="storefront.settings.allowGuestCheckout"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Allow Guest Checkout
                            </FormLabel>
                            <FormDescription>
                              Let customers check out without creating an
                              account
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
                      name="storefront.settings.requireLogin"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Require Login to Browse
                            </FormLabel>
                            <FormDescription>
                              Require customers to log in before viewing
                              products
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={
                                !form.watch("storefront.settings.isEnabled")
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="flex flex-col space-y-1.5">
                    <h3 className="text-lg font-semibold">Localization</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure regional settings for your store
                    </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="storefront.settings.currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USD">
                                USD - US Dollar ($)
                              </SelectItem>
                              <SelectItem value="NGN">
                                NGN - Nigerian Naira (₦)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Currency used for pricing and transactions.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="storefront.settings.timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timezone</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a timezone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timezones.map((timezone) => (
                                <SelectItem
                                  key={timezone.value}
                                  value={timezone.value}
                                >
                                  {timezone.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Used for scheduling and reporting.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex flex-col space-y-1.5">
                    <h3 className="text-lg font-semibold">Shipping Address</h3>
                    <p className="text-sm text-muted-foreground">
                      This address will be used for shipping calculations and
                      returns
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="shipping.address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="123 Main St, Suite 100"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="shipping.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="shipping.zipcode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal / ZIP Code</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="ZIP / Postal code"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="shipping.country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="United States">
                                  United States
                                </SelectItem>
                                <SelectItem value="Nigeria">Nigeria</SelectItem>
                                <SelectItem value="United Kingdom">
                                  United Kingdom
                                </SelectItem>
                                <SelectItem value="Canada">Canada</SelectItem>
                                <SelectItem value="Australia">
                                  Australia
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                    <MapPin className="h-4 w-4" />
                    <AlertDescription>
                      This address will be used to calculate shipping rates and
                      for return labels.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex flex-col space-y-1.5">
                    <h3 className="text-lg font-semibold">
                      Contact Information
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      How customers can reach your business
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="contact.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="contact@yourbusiness.com"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Public email for customer inquiries
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contact.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormDescription>
                            Business phone number
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="flex flex-col space-y-1.5">
                    <h3 className="text-lg font-semibold">Social Media</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect your store to your social media presence
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="contact.socialMedia.instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram Username</FormLabel>
                          <FormControl>
                            <Input placeholder="@yourstore" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contact.socialMedia.facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook Page</FormLabel>
                          <FormControl>
                            <Input placeholder="yourstorename" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contact.socialMedia.twitter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>X / Twitter Username</FormLabel>
                          <FormControl>
                            <Input placeholder="@yourstore" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                    <Globe className="h-4 w-4" />
                    <AlertDescription>
                      Social media links will be displayed in your store footer
                      and on your contact page.
                    </AlertDescription>
                  </Alert>
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
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
