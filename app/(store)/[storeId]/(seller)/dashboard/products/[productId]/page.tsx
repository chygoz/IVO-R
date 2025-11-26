"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Edit,
  Eye,
  Info,
  Loader2,
  MoreHorizontal,
  Package,
  Pencil,
  ShoppingBag,
  Trash,
  BarChart3,
  TrendingUp,
  DollarSign,
} from "lucide-react";

import { Product } from "@/types/product";
import Image from "next/image";
import { useStore } from "@/contexts/reseller-store-context";
import { useApiClient } from "@/lib/api/use-api-client";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const base = `/${(pathname.split("/")[1] || "").trim()}`;
  const apiClient = useApiClient();
  const productId = params.productId as string;
  const { toast } = useToast();
  const { store } = useStore();

  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showUnpublishDialog, setShowUnpublishDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [image, setImage] = useState<string | null>(null)

  // Load product
  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.seller.get(
          `/api/v1/products/${productId}`
        );

        if (response) {
          setProduct(response.data);
        } else {
          throw new Error("Failed to load product");
        }
      } catch (error: any) {
        console.error("Failed to load product:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load product details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId, toast, apiClient.seller]);
  const allGalleryImages = product?.variants.flatMap((variant) =>
    variant.gallery.map((img) => ({
      ...img,
      variantName: variant.name,
    }))
  );


  // Check if product can be edited
  const canEdit = product?.status === "draft" && product?.source === "product";

  // Check if product can be published
  const canPublish = product?.status === "ready";

  // Check if product can be unpublished
  const canUnpublish = product?.status === "published";

  const isPending = product?.status === "pending";

  const isBlankProduct = product?.source === "blank";

  // Get unique sizes from variants
  const getUniqueSizes = () => {
    if (!product || !product.variants) return [];

    const sizesMap = new Map();

    product.variants.forEach((variant) => {
      variant.sizes.forEach((size) => {
        if (!sizesMap.has(size.name)) {
          sizesMap.set(size.name, size);
        }
      });
    });

    return Array.from(sizesMap.values()).sort(
      (a: any, b: any) => a.sortOrder - b.sortOrder
    );
  };

  // Format currency
  const formatCurrency = (value: string | number, currency: string = "NGN") => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
    }).format(Number(value));
  };

  // Format date
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate total quantity
  const getTotalQuantity = () => {
    if (!product || !product.variants) return 0;
    return product.variants.reduce((total, variant) => {
      return (
        total +
        variant.sizes.reduce((sizeTotal, size) => {
          return sizeTotal + size.quantity;
        }, 0)
      );
    }, 0);
  };

  // Handle edit product
  const handleEditProduct = () => {
    if (!canEdit) return;
    router.push(`${base}/dashboard/products/${product!._id}/edit`);
  };

  // Handle publish/unpublish product
  const handleStatusChange = async (action: "publish" | "unpublish") => {
    if (!product) return;

    setIsUpdatingStatus(true);

    try {
      const response = await apiClient.seller.put(
        `/api/v1/products/${product._id}/status`,
        { status: "publish" === action ? "published" : "draft" }
      );

      if (response.success) {
        setProduct(response.data);
        toast({
          title:
            action === "publish" ? "Product Published" : "Product Unpublished",
          description: `The product has been ${action === "publish" ? "published" : "unpublished"
            } successfully`,
        });
      } else {
        throw new Error(response.message || `Failed to ${action} product`);
      }
    } catch (error: any) {
      console.error(`Failed to ${action} product:`, error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${action} product`,
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
      setShowPublishDialog(false);
      setShowUnpublishDialog(false);
    }
  };

  // Handle delete product
  const handleDeleteProduct = async () => {
    if (!product) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Product deleted",
          description: "The product has been deleted successfully",
        });

        router.push(`${base}/dashboard/products`);
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error: any) {
      console.error("Failed to delete product:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // Go back to products
  const handleBack = () => {
    router.push(`${base}/dashboard/products`);
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 px-4"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-center text-muted-foreground">
          Loading product details...
        </p>
      </motion.div>
    );
  }

  if (!product) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-12 px-4 text-center"
      >
        <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-lg font-medium mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The product you&apos;re looking for doesn&apos;t exist or has been
          removed
        </p>
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Mobile Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div className="flex items-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mr-2 mt-1 flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight break-words capitalize">
              {product.name}
            </h1>
            <p className="text-muted-foreground text-sm">
              Product Code: {product.code}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={product.source === "product" ? "default" : "secondary"}
                className="text-xs"
              >
                {product.source === "product" ? "Original" : "Blank"}
              </Badge>
              {product.source === "blank" && (
                <span className="text-xs text-muted-foreground">
                  • Created from blank
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {canEdit && (
            <Button
              variant="outline"
              onClick={handleEditProduct}
              className="gap-1 text-sm"
              size="sm"
            >
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Edit Product</span>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  toast({
                    title: "View on Store",
                    description: "Navigating to store view",
                  });
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                View on Store
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://${store.storefront.domain.subdomain}.resellerivo.com/products/${product.slug}`
                  );
                  toast({
                    title: "URL Copied",
                    description: "Product URL copied to clipboard",
                  });
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Product URL
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="variants" className="text-xs sm:text-sm">
                Variants ({product.variants.length})
              </TabsTrigger>
              <TabsTrigger value="details" className="text-xs sm:text-sm">
                Details
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs sm:text-sm">
                Analytics
              </TabsTrigger>
            </TabsList>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="overview" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Overview</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Product Image and Gallery */}
                    <div className="space-y-4">
                      <div className="aspect-square bg-gray-100 rounded-md relative overflow-hidden">
                        {product.variants[0]?.gallery?.[0]?.url ? (
                          <Image
                            width={500}
                            height={500}
                            src={image ? image : product.variants[0]?.gallery?.[0]?.url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Package className="h-16 w-16 text-gray-400" />
                          </div>
                        )}

                        <Badge
                          className="absolute top-3 right-3"
                          variant={
                            product.status === "published"
                              ? "default"
                              : product.status === "ready"
                                ? "secondary"
                                : product.status === "pending"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {product.status === "published"
                            ? "Published"
                            : product.status === "ready"
                              ? "Ready"
                              : product.status === "pending"
                                ? "Pending"
                                : "Draft"}
                        </Badge>
                      </div>

                      {/* Gallery Thumbnails */}
                      <div className="grid grid-cols-4 gap-2">
                        {
                          allGalleryImages?.map((el, index) => {
                            return (
                              <div
                                key={index}
                                className="aspect-square bg-gray-100 rounded-md overflow-hidden"
                              >
                                <Image
                                  key={`${index}-${el.url}`}
                                  width={500}
                                  height={500}
                                  src={el.url}
                                  alt={`${product.name} - ${el.variantName}`}
                                  className="w-full h-full object-cover"
                                  onClick={() => setImage(el.url)}
                                />
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>

                    <Separator />

                    {/* Product Details */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Description
                          </h3>
                          <p className="mt-1 text-sm">{product.description}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Category
                          </h3>
                          <p className="mt-1 text-sm">
                            {product?.category?.name}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Gender
                          </h3>
                          <p className="mt-1 text-sm capitalize">
                            {product?.gender}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Base Price
                          </h3>
                          <p className="mt-1 text-lg font-bold">
                            {formatCurrency(
                              product?.basePrice?.value,
                              product?.basePrice?.currency
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Tags
                          </h3>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {product.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Available Colors
                          </h3>
                          <div className="mt-2 flex gap-2">
                            {product.variants.map((variant, index) => (
                              <div
                                key={index}
                                className="h-6 w-6 rounded-full border"
                                style={{ backgroundColor: variant.hex }}
                                title={variant.name}
                              />
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Available Sizes
                          </h3>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {getUniqueSizes().map((size, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {size.displayName}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Stock Level
                          </h3>
                          <p className="mt-1 text-sm">
                            {"-"} units total
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Created Date
                          </h3>
                          <p className="mt-1 text-sm">
                            {formatDate(product.createdAt)}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Product Type
                          </h3>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge
                              variant={
                                product.source === "product"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {product.source === "product"
                                ? "Original"
                                : "Blank"}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              {product.source === "product"
                                ? "Created by you"
                                : "Created from blank"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="variants" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Variants</CardTitle>
                    <CardDescription>
                      {product.variants.length} variants available
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-6">
                      {product.variants.map((variant, variantIndex) => (
                        <div key={variantIndex} className="space-y-3">
                          <h3 className="font-medium flex items-center text-sm sm:text-base">
                            <div
                              className="h-4 w-4 rounded-full mr-2"
                              style={{ backgroundColor: variant.hex }}
                            />
                            <span className="capitalize">{variant.name}</span>
                            <span className="ml-1 text-muted-foreground text-sm">
                              ({variant.sizes.length} sizes)
                            </span>
                          </h3>

                          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-xs">
                                    Size
                                  </TableHead>
                                  <TableHead className="text-xs">SKU</TableHead>
                                  <TableHead className="text-xs">
                                    Quantity
                                  </TableHead>
                                  <TableHead className="text-xs">
                                    Status
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {variant.sizes.map((size, sizeIndex) => (
                                  <TableRow key={sizeIndex}>
                                    <TableCell className="font-medium text-xs">
                                      {size.displayName}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                      {size.sku}
                                    </TableCell>
                                    <TableCell className="text-xs">
                                      {"-"} units
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        variant={
                                          size.status === "in-stock"
                                            ? "default"
                                            : "destructive"
                                        }
                                        className="text-xs"
                                      >
                                        {size.status === "in-stock"
                                          ? "In Stock"
                                          : "Out of Stock"}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Information</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">SEO Settings</h3>
                      <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
                        <div>
                          <h4 className="text-sm font-medium">Title</h4>
                          <p className="text-sm mt-1">
                            {product.seo?.title || product.name}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium">Description</h4>
                          <p className="text-sm mt-1">
                            {product.seo?.description || product.description}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium">Keywords</h4>
                          <p className="text-sm mt-1">
                            {product.seo?.keywords || product.tags.join(", ")}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium">URL</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-blue-600 break-all">
                              {`${store.storefront.domain.subdomain}.resellerivo.com`}
                              /products/{product.slug}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `https://${store.storefront.domain.subdomain}.resellerivo.com/products/${product.slug}`
                                );
                                toast({
                                  title: "URL Copied",
                                  description:
                                    "Product URL copied to clipboard",
                                });
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Shipping Information</h3>
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium">Weight</h4>
                            <p className="text-sm mt-1">
                              {product.shipping?.weight || "-"} kg
                            </p>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium">
                              Dimensions (L × W × H)
                            </h4>
                            <p className="text-sm mt-1">
                              {product.shipping?.dimensions?.length || "-"} ×{" "}
                              {product.shipping?.dimensions?.width || "-"} ×{" "}
                              {product.shipping?.dimensions?.height || "-"} cm
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Product Timeline</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <Pencil className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              Product Created
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(product.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <Edit className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Last Updated</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(product.updatedAt)}
                            </p>
                          </div>
                        </div>

                        {product.status === "published" && (
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                Published to Store
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(product.updatedAt)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Performance Analytics
                    </CardTitle>
                    <CardDescription>
                      Sales and performance metrics for this product
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      <Card>
                        <CardHeader className="p-4">
                          <CardTitle className="text-base text-muted-foreground flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Total Views
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="text-2xl sm:text-3xl font-bold">
                            {/* {Math.floor(Math.random() * 1000) + 100} */}0
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Last 30 days
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="p-4">
                          <CardTitle className="text-base text-muted-foreground flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4" />
                            Total Sales
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="text-2xl sm:text-3xl font-bold">
                            {/* {Math.floor(Math.random() * 50) + 5} */}0
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Last 30 days
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="p-4">
                          <CardTitle className="text-base text-muted-foreground flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Total Revenue
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="text-2xl sm:text-3xl font-bold">
                            {formatCurrency(
                              0,
                              // Math.floor(Math.random() * 100000) + 10000,
                              product?.basePrice?.currency
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Last 30 days
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="p-4">
                          <CardTitle className="text-base text-muted-foreground flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Conversion Rate
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="text-2xl sm:text-3xl font-bold">
                            {/* {(Math.random() * 10 + 2).toFixed(1)}% */}
                            0%
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Views to purchases
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="font-medium mb-4">
                        Top Performing Variants
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-xs">Variant</TableHead>
                              <TableHead className="text-xs">Color</TableHead>
                              <TableHead className="text-xs text-right">
                                Sales
                              </TableHead>
                              <TableHead className="text-xs text-right">
                                Revenue
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {product.variants
                              .slice(0, 5)
                              .map((variant, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium text-xs">
                                    {variant.name}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center">
                                      <div
                                        className="h-3 w-3 rounded-full mr-2"
                                        style={{ backgroundColor: variant.hex }}
                                      />
                                      <span className="capitalize text-xs">
                                        {variant.name}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right text-xs">
                                    {Math.floor(Math.random() * 20) + 5} units
                                  </TableCell>
                                  <TableCell className="text-right text-xs">
                                    {formatCurrency(
                                      (Math.floor(Math.random() * 20) + 5) *
                                      Number(product.basePrice.value),
                                      product.basePrice.currency
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div className="mt-8 p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <Info className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800">
                            Analytics Information
                          </h3>
                          <div className="mt-2 text-sm text-blue-700">
                            <p>
                              Analytics data is updated every 24 hours. More
                              detailed reports are available in the Analytics
                              section.
                            </p>
                          </div>
                          <div className="mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                toast({
                                  title: "View Analytics",
                                  description:
                                    "Navigating to analytics dashboard",
                                });
                              }}
                              className="text-blue-600 border-blue-600"
                            >
                              <BarChart3 className="h-4 w-4 mr-2" />
                              View Full Analytics
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Status</CardTitle>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                <div className="flex items-center mb-4">
                  {product.status === "published" ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                      <div>
                        <p className="font-medium text-sm">Published</p>
                        <p className="text-xs text-muted-foreground">
                          This product is live on your store
                        </p>
                      </div>
                    </>
                  ) : product.status === "ready" ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2" />
                      <div>
                        <p className="font-medium text-sm">Ready to Publish</p>
                        <p className="text-xs text-muted-foreground">
                          This product is ready to go live
                        </p>
                      </div>
                    </>
                  ) : product.status === "pending" ? (
                    <>
                      <Loader2 className="h-5 w-5 text-orange-500 mr-2 animate-spin" />
                      <div>
                        <p className="font-medium text-sm">Pending Approval</p>
                        <p className="text-xs text-muted-foreground">
                          {isBlankProduct
                            ? "This product is awaiting approval from the creator"
                            : "This product is awaiting approval"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                      <div>
                        <p className="font-medium text-sm">Draft</p>
                        <p className="text-xs text-muted-foreground">
                          {isBlankProduct
                            ? "This product was created from a template"
                            : "This product is not yet published"}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {canPublish && (
                  <Button
                    className="w-full"
                    onClick={() => setShowPublishDialog(true)}
                    disabled={isUpdatingStatus}
                  >
                    {isUpdatingStatus ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      "Publish Product"
                    )}
                  </Button>
                )}

                {canUnpublish && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowUnpublishDialog(true)}
                    disabled={isUpdatingStatus}
                  >
                    {isUpdatingStatus ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Unpublishing...
                      </>
                    ) : (
                      "Unpublish"
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Inventory Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Inventory</CardTitle>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Stock</p>
                    <p className="text-xl font-bold">
                      {"-"} units
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Variants</p>
                    <p className="text-xl font-bold">
                      {product.variants.length} variants
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      Inventory by Color
                    </h3>
                    {product.variants.map((variant, index) => {
                      const colorTotal = variant.sizes.reduce(
                        (total, size) => total + size.quantity,
                        0
                      );

                      return (
                        <div
                          key={index}
                          className="flex justify-between items-center mb-2"
                        >
                          <div className="flex items-center">
                            <div
                              className="h-3 w-3 rounded-full mr-2"
                              style={{ backgroundColor: variant.hex }}
                            />
                            <span className="text-sm capitalize">
                              {variant.name}
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            {colorTotal} units
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Manage Inventory",
                        description: "Navigating to inventory management",
                      });
                    }}
                  >
                    Manage Inventory
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      toast({
                        title: "Preview Product",
                        description: "Opening product preview",
                      });
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Product
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      toast({
                        title: "Duplicate Product",
                        description: "Creating a duplicate of this product",
                      });
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate Product
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-red-50 p-4 rounded-md border border-red-100 my-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Warning</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Deleting this product will remove it from your store and all
                    associated inventory and sales data will be lost.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProduct}
              disabled={isDeleting}
              className="w-full sm:w-auto"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish confirmation dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Publish Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to publish this product? It will be visible
              to customers on your store.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-green-50 p-4 rounded-md border border-green-100 my-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Ready to Publish
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    This product meets all requirements and is ready to be
                    published to your store.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPublishDialog(false)}
              disabled={isUpdatingStatus}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleStatusChange("publish")}
              disabled={isUpdatingStatus}
              className="w-full sm:w-auto"
            >
              {isUpdatingStatus ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish Product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unpublish confirmation dialog */}
      <Dialog open={showUnpublishDialog} onOpenChange={setShowUnpublishDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Unpublish Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to unpublish this product? It will no longer
              be visible to customers.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100 my-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Impact</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Unpublishing this product will hide it from your store.
                    Customers will no longer be able to view or purchase it.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowUnpublishDialog(false)}
              disabled={isUpdatingStatus}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleStatusChange("unpublish")}
              disabled={isUpdatingStatus}
              className="w-full sm:w-auto"
            >
              {isUpdatingStatus ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Unpublishing...
                </>
              ) : (
                "Unpublish Product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
