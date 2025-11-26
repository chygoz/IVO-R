"use client";

import { useState, useEffect, startTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LogoUploader } from "./logo-uploader";
import { BannerUploader } from "./banner-uploader";
import { ColorScheme } from "./color-scheme";
import { CheckCircle, AlertCircle, RefreshCw, Eye } from "lucide-react";
import { StoreTheme, themeTemplates } from "@/components/store/templates/utils";
import { useStore } from "@/contexts/reseller-store-context";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(2, "Store name must be at least 2 characters"),
  logo: z.string().optional(),
  banner: z.string().optional(),
  headline: z
    .string()
    .max(120, "Headline must be less than 120 characters")
    .optional(),
  subtext: z
    .string()
    .max(250, "Subtext must be less than 250 characters")
    .optional(),
  theme: z.enum(["luxury", "bold", "classic", "modern", "minimal"]),
  primaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6})$/, "Must be a valid hex color"),
  secondaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6})$/, "Must be a valid hex color"),
  accentColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6})$/, "Must be a valid hex color"),
  backgroundColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6})$/, "Must be a valid hex color"),
  textColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6})$/, "Must be a valid hex color"),
  seo: z.object({
    title: z.string().min(5, "SEO title must be at least 5 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    keywords: z.string(),
  }),
});
interface BrandingFormValues extends z.infer<typeof formSchema> { }

export default function BrandingSettings() {
  const { store } = useStore();
  const router = useRouter();
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const storeId = store._id;

  const initialData: BrandingFormValues = {
    name: store.name,
    logo: store.logo,
    banner: store.storefront?.theme?.bannerImage || "",
    headline:
      store.storefront?.theme?.headline ||
      "Timeless elegance for the discerning customer",
    subtext:
      store?.storefront?.theme?.subtext ||
      "Discover our curated collection of premium products designed for those who appreciate quality and sophistication.",
    //@ts-expect-error
    theme: store.storefront?.theme?.template || "luxury",
    primaryColor: store?.storefront?.theme?.primaryColor || "#8A6D3B",
    secondaryColor: store?.storefront?.theme?.secondaryColor || "#F0EAD6",
    accentColor: store?.storefront?.theme?.accentColor || "#DFD7BF",
    backgroundColor: store?.storefront?.theme?.backgroundColor || "#FFFFFF",
    textColor: store?.storefront?.theme?.textColor || "#333333",
    seo: {
      title:
        store?.storefront?.seo?.title || `${store.name} | Premium Products`,
      description:
        store?.storefront?.seo?.description ||
        `Shop premium products at ${store.name}`,
      keywords:
        store.storefront.seo?.keywords?.join(",") ||
        "luxury, premium, high-end",
    },
  };

  const form = useForm<BrandingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  // Create a theme object from form values
  const getCurrentTheme = (): StoreTheme => ({
    template: form.watch("theme"),
    colors: {
      primary: form.watch("primaryColor"),
      secondary: form.watch("secondaryColor"),
      accent: form.watch("accentColor"),
      background: form.watch("backgroundColor"),
      text: form.watch("textColor"),
    },
    logo: form.watch("logo"),
    name: form.watch("name"),
    id: storeId,
    headline: form.watch("headline"),
    subtext: form.watch("subtext"),
  });

  // When form values change, update the isDirty state
  useEffect(() => {
    const subscription = form.watch(() => {
      setIsDirty(true);
    });
    return () => subscription.unsubscribe();
    //eslint-disable-next-line
  }, [form.watch]);

  // When template changes, update the colors
  const watchTheme = form.watch("theme");

  useEffect(() => {
    const template = themeTemplates.find((t) => t.id === watchTheme);
    if (template) {
      form.setValue("primaryColor", template.colors.primary);
      form.setValue("secondaryColor", template.colors.secondary);
      form.setValue("accentColor", template.colors.accent);
      form.setValue("backgroundColor", template.colors.background);
      form.setValue("textColor", template.colors.text);
    }
  }, [watchTheme, form]);

  // Modified onSubmit function in BrandingSettings component

  const onSubmit = async (data: BrandingFormValues) => {
    try {
      setIsSubmitting(true);

      const payload = {
        businessId: storeId,
        name: data.name,
        template: data.theme,
        colors: {
          primary: data.primaryColor,
          secondary: data.secondaryColor,
          accent: data.accentColor,
          background: data.backgroundColor,
          text: data.textColor,
        },
        logo: data.logo,
        banner: data.banner,
        headline: data.headline,
        subtext: data.subtext,
        seo: data.seo,
      };

      console.log(
        "Preparing to submit branding data (hot form): ",
        form.getValues()
      );

      console.log("Submitting branding data:", payload);

      const response = await fetch("/api/branding", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update branding");
      }

      const result = await response.json();

      if (result.nameChanged && result.newUrl) {
        toast({
          title: "Store updated successfully!",
          description: "Redirecting to your new store URL...",
          duration: 3000,
        });

        // Use router.push instead of window.location for better UX
        setTimeout(() => {
          router.push(result.newUrl);
        }, 1500);
      } else {
        toast({
          title: "Store updated successfully!",
          description: "Your branding changes have been saved.",
          duration: 3000,
        });

        // Refresh the page to show updated data
        router.refresh();
      }

      setIsDirty(false);
    } catch (error) {
      console.error("Error saving store settings:", error);
      toast({
        title: "Error updating store",
        description:
          error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  // Handle logo and banner uploads
  const handleLogoUpload = (logoData: { url: string; publicId: string }) => {
    form.setValue("logo", logoData.url);
    setIsDirty(true);
  };

  const handleBannerUpload = (bannerData: {
    url: string;
    publicId: string;
  }) => {
    form.setValue("banner", bannerData.url);
    // Update the banner in the store's theme

    setIsDirty(true);
  };

  useEffect(() => {
    if (form.formState.errors) {
      const error = Object.values(form.formState.errors)[0] as any
      if (error) {
        toast({
          title: "Error With Form",
          description: error.title.message,
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  }, [form.formState.errors])

  // Handle theme preview
  const handleThemePreview = () => {
    const theme = getCurrentTheme();
    const encodedTheme = encodeURIComponent(JSON.stringify(theme));
    window.open(`/preview?theme=${encodedTheme}`, "_blank");
  };

  // Apply a predefined color combination
  const applyColorCombination = (primary: string, secondary: string) => {
    form.setValue("primaryColor", primary);
    form.setValue("secondaryColor", secondary);
    setIsDirty(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-col sm:items-center sm:justify-between gap-2">
        <h2 className="text-2xl font-semibold">Store Branding</h2>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={handleThemePreview}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview Store
          </Button>

          <Button
            type="submit"
            size="sm"
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

      <Form {...form}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList
            className="mb-6 flex w-full overflow-x-auto whitespace-nowrap scrollbar-hide gap-2 px-1"
            style={{
              scrollSnapType: "x mandatory",
              justifyContent: "flex-start",
            }}
          >
            <TabsTrigger
              className="flex-shrink-0 min-w-max scroll-snap-start"
              value="general"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              className="flex-shrink-0 min-w-max scroll-snap-start"
              value="theme"
            >
              Theme & Colors
            </TabsTrigger>
            <TabsTrigger
              className="flex-shrink-0 min-w-max scroll-snap-start"
              value="seo"
            >
              SEO Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="p-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Name</FormLabel>
                      <FormControl>
                        <Input
                          className="capitalize"
                          placeholder="Store name"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This will be displayed throughout your store.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                {/* Add headline and subtext fields */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Store Messaging</h3>

                  <FormField
                    control={form.control}
                    name="headline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Headline</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your main headline"
                            {...field}
                            className="resize-none h-20"
                            maxLength={120}
                          />
                        </FormControl>
                        <FormDescription>
                          This is the main headline displayed on your homepage (
                          {field.value?.length || 0}/120).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subtext"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supporting Text</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a brief description for your store"
                            {...field}
                            className="resize-none h-24"
                            maxLength={250}
                          />
                        </FormControl>
                        <FormDescription>
                          This text appears below your headline on the homepage
                          ({field.value?.length || 0}/250).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="p-4 rounded-md border bg-muted/30">
                    <div className="mb-2">
                      <h4
                        className="text-xl font-medium mb-2"
                        style={{ color: form.watch("primaryColor") }}
                      >
                        {form.watch("headline") ||
                          "Your headline will appear here"}
                      </h4>
                      <p
                        className="text-sm"
                        style={{ color: form.watch("textColor") + "99" }}
                      >
                        {form.watch("subtext") ||
                          "Your supporting text will appear here, providing more context for your visitors."}
                      </p>
                    </div>
                  </div>
                </div>
                <Separator />

                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Logo</FormLabel>
                      <FormDescription>
                        Upload a square logo for your store. This will appear on
                        your storefront and dashboard.
                      </FormDescription>
                      <FormControl>
                        <LogoUploader
                          currentLogo={field.value}
                          onChange={handleLogoUpload}
                          idealDimension={400}
                          maxFileSizeMB={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                <FormField
                  control={form.control}
                  name="banner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Banner</FormLabel>
                      <FormDescription>
                        Upload a banner for your store homepage (recommended
                        size: 1200×400px).
                      </FormDescription>
                      <FormControl>
                        <BannerUploader
                          currentBanner={field.value}
                          onChange={handleBannerUpload}
                          primaryColor={form.watch("primaryColor")}
                          secondaryColor={form.watch("secondaryColor")}
                          storeName={form.watch("name")}
                          maxFileSizeMB={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="theme" className="space-y-6">
            <Card className="p-6">
              <div className="space-y-6">
                {/* Use the ColorScheme component here */}
                <ColorScheme
                  control={form.control}
                  watch={form.watch}
                  applyColorCombination={applyColorCombination}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <Card className="p-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="seo.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Title</FormLabel>
                      <FormControl>
                        <Input
                          className="capitalize"
                          placeholder="Your store name | Tagline"
                          {...field}
                          maxLength={60}
                        />
                      </FormControl>
                      <FormDescription>
                        The title that appears in search engine results (
                        {field.value.length}/60 characters).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seo.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A brief description of your store"
                          {...field}
                          maxLength={160}
                          className="resize-none h-24"
                        />
                      </FormControl>
                      <FormDescription>
                        A short description that appears in search results (
                        {field.value.length}/160 characters).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seo.keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="luxury, premium, high-end, quality, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Comma-separated keywords related to your store
                        (optional).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Good SEO helps customers find your store in search engines
                    like Google.
                  </AlertDescription>
                </Alert>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Form>

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
