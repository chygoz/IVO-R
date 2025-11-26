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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Check,
  AlertTriangle,
  Globe,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useStore } from "@/contexts/reseller-store-context";
import { PROTOCOL } from "@/constants";

interface DomainFormValues {
  subdomain: string;
  customDomain: string;
}

const formSchema = z.object({
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters")
    .max(30, "Subdomain must be less than 30 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Subdomain can only contain lowercase letters, numbers, and hyphens"
    ),
  customDomain: z.string().optional(),
});

export default function DomainSettings() {
  const [customDomainVerified, setCustomDomainVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { store } = useStore();

  // Mock data - in production you'd fetch this from API
  const initialData = {
    subdomain: store.storefront.domain.subdomain,
    customDomain: "",
  };

  const baseUrl = "resellerivo.com";

  const form = useForm<DomainFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: DomainFormValues) => {
    try {
      setUpdating(true);

      // API call would go here
      console.log("Form submitted:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setUpdating(false);
    } catch (error) {
      console.error("Error updating domain settings:", error);
      setUpdating(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleVerifyDomain = async () => {
    const customDomain = form.watch("customDomain");

    if (!customDomain) return;

    try {
      setVerifying(true);

      // API call would go here
      // In production, this would check DNS settings

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo purposes, we'll toggle it
      setCustomDomainVerified(!customDomainVerified);
      setVerifying(false);
    } catch (error) {
      console.error("Error verifying domain:", error);
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Domain Settings</h2>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-2">Subdomain</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your store is accessible via a subdomain on {baseUrl}
                </p>

                <FormField
                  control={form.control}
                  name="subdomain"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2 mb-2">
                        <FormLabel>Store Subdomain</FormLabel>
                        <Badge variant="secondary">Included</Badge>
                      </div>
                      <div className="flex">
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <div className="flex items-center px-3 border rounded-r-md bg-muted">
                          .{baseUrl}
                        </div>
                      </div>
                      <FormDescription>
                        This is the default URL for your store.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="mt-4 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Your store URL:
                    <a
                      href={`${PROTOCOL}://${form.watch(
                        "subdomain"
                      )}.${baseUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 font-medium text-primary hover:underline flex-inline items-center"
                    >
                      {PROTOCOL}://{form.watch("subdomain")}.{baseUrl}
                      <ExternalLink className="h-3 w-3 ml-1 inline" />
                    </a>
                  </span>
                </div>
              </div>

              <Separator />
            </div>

            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                disabled={updating}
              >
                {updating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
