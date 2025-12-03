"use client";

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  startTransition,
} from "react";
import { useRouter, useSearchParams, usePathname, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  Filter,
  Search,
  Package,
  Tag,
  Truck,
  Trash2,
  Edit,
  List,
  LayoutGrid,
  FileText,
  Upload,
  FileQuestion,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

import { useProductStore } from "@/store/product-store";
import { useAuth } from "@/contexts/auth-context";
import { useStore } from "@/contexts/reseller-store-context";
import { Product } from "@/store/product-store";
import { ApiProductsResponse } from "@/types/product";
import { validateProductForSubmission } from "@/lib/api/product-submission";
import { submissionApi } from "@/lib/api/submissions";
import Image from "next/image";
import Link from "next/link";

// Define view type
type ViewType = "list" | "grid";

// Pagination type for the API response
interface PaginationMeta {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams() as { storeId?: string };
  const storeId = params.storeId;
  const isPathBased = pathname?.startsWith(`/${storeId}`);
  const base = isPathBased ? `/${storeId}` : "";
  const { user } = useAuth();
  const { toast } = useToast();
  const { store } = useStore();

  const businessId = store?._id || "";

  // Global product state
  const { drafts, userPermissions } = useProductStore();

  // Local state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState(searchParams.get("status") || "all");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, boolean>
  >({});
  const [submissionName, setSubmissionName] = useState("");
  const [isSubmissionSheetOpen, setIsSubmissionSheetOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewType, setViewType] = useState<ViewType>("list");
  const [pageNumber, setPageNumber] = useState<number>(
    Number(searchParams.get("p") || 1)
  );
  const [pagination, setPagination] = useState<PaginationMeta>({
    totalCount: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  // Load products
  // In the Products page component, modify the useEffect for fetching drafts:
  const refreshProducts = useCallback(async () => {
    if (!businessId) return;

    setIsLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append("business", businessId);
      params.append("p", pageNumber.toString());
      params.append("l", "10");
      params.append("sortBy", "createdAt");
      params.append("sortDir", "desc");

      if (filter !== "all") {
        params.append("status", filter);
      }

      if (searchQuery) {
        params.append("q", searchQuery);
      }

      // Fetch products from the API
      const response = await fetch(`/api/products?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const apiResponse: ApiProductsResponse = await response.json();

      // Extract the data from the response structure
      if (apiResponse.status === "ok" && apiResponse.data) {
        //@ts-expect-error
        setProducts(apiResponse.data.results);
        setPagination(apiResponse.data.metadata);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
      toast({
        title: "Error loading products",
        description: "Failed to load your products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [businessId, filter, searchQuery, pageNumber, toast]);

  const fetchAllDrafts = useCallback(async () => {
    if (!businessId) return;

    try {
      const params = new URLSearchParams();
      params.append("business", businessId);
      params.append("status", "draft");
      params.append("limit", "100"); // Get more drafts to ensure we have them all

      const response = await fetch(`/api/products?${params.toString()}`);

      if (!response.ok) {
        console.error("Failed to fetch drafts");
        return;
      }

      const apiResponse: ApiProductsResponse = await response.json();

      if (apiResponse.status === "ok" && apiResponse.data) {
        // Update the Zustand store with the latest drafts from API
        const apiDrafts = apiResponse.data.results;

        // Replace the entire drafts array with the API version
        // Instead of trying to merge or sync
        useProductStore.setState({
          //@ts-expect-error
          drafts: apiDrafts,
        });
      }
    } catch (error) {
      console.error("Failed to fetch drafts:", error);
    }
  }, [businessId]);

  // Load products and sync drafts
  useEffect(() => {
    // Initial data load
    refreshProducts();

    // Always fetch drafts separately to ensure we have the complete list
    // This is needed for the drafts tab and submission modal
    fetchAllDrafts();

    // Set up interval for periodic draft refresh (every 30 seconds)
    const draftsRefreshInterval = setInterval(fetchAllDrafts, 30000);

    // Cleanup
    return () => {
      clearInterval(draftsRefreshInterval);
    };
  }, [refreshProducts, fetchAllDrafts]);

  // Handle product selection for submission
  const handleProductSelect = useCallback(
    (productId: string, isSelected: boolean) => {
      const product =
        products.find((p) => p._id === productId) ||
        drafts.find((d) => d._id === productId);

      // Only allow selection if it's a draft
      if (product && product.status === "draft") {
        setSelectedProducts((prev) => ({
          ...prev,
          [productId]: isSelected,
        }));
      } else if (isSelected) {
        // If trying to select a non-draft, show a message
        toast({
          title: "Cannot select this product",
          description: "Only draft products can be selected for submission",
        });
      }
    },
    [products, drafts, toast]
  );

  const handleCreateProduct = () => {
    try {
      startTransition(async () => {
        setIsLoading(true);
        const response = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "untitled product", // Default name
            business: businessId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create product");
        }

        const apiResponse = await response.json();

        if (apiResponse.status !== "ok" || !apiResponse.data) {
          throw new Error("Invalid API response format");
        }

        // Navigate to edit page with the API-created product's ID
        router.push(
          `${base}/dashboard/products/create?draftId=${apiResponse.data._id}`
        );

        // Refresh the product list to show the new draft
        refreshProducts();
      });
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Error creating product",
        description: "Failed to create a new product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Browse blanks
  const handleBrowseBlanks = () => {
    router.push(`${base}/dashboard/products/blanks`);
  };

  // Handle various product actions
  const handleProductAction = async (productId: string, action: string) => {
    try {
      if (action === "edit") {
        router.push(`${base}/dashboard/products/${productId}/edit`);
      } else if (action === "view") {
        router.push(`${base}/dashboard/products/${productId}`);
      } else if (action === "delete") {
        // For all product types, delete through the API
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete product");
        }

        toast({
          title: "Product deleted",
          description: "The product has been deleted successfully",
        });

        // Refresh the products list to reflect the deletion
        refreshProducts();
        fetchAllDrafts();
      }
    } catch (error) {
      console.error(
        `Error performing action ${action} on product ${productId}:`,
        error
      );
      toast({
        title: "Action failed",
        description: `Failed to ${action} the product. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleSubmitForApproval = async () => {
    setIsSubmitting(true);

    try {
      const selectedIds = Object.entries(selectedProducts)
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      if (selectedIds.length === 0) {
        toast({
          title: "No products selected",
          description: "Please select at least one product for submission",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Validate selected products
      const invalidProducts = selectedIds
        .map((id) => {
          const product = drafts.find((p) => p._id === id);
          if (!product) return null;
          const validation = validateProductForSubmission(product);
          return !validation.isValid ? { id, issues: validation.issues } : null;
        })
        .filter(Boolean);

      if (invalidProducts.length > 0) {
        // Show validation errors
        toast({
          title: "Products have validation issues",
          description: "Some products need to be completed before submission",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Submit products directly via API
      const submissionData = {
        type: "product",
        category: "add",
        items: selectedIds,
        name: submissionName,
        message: submissionMessage || "Products submitted for approval",
      };

      // Use the submission API
      const result = await submissionApi.createSubmission(submissionData);
      console.log(result, "result");

      if (result) {
        // Reset selection and close dialog
        setSelectedProducts({});
        setIsSubmitDialogOpen(false);
        setSubmissionName("");
        setSubmissionMessage("");

        // Show success message
        toast({
          title: "Products submitted for approval",
          description: `${selectedIds.length} product(s) have been submitted for approval.`,
        });

        // Refresh the product list
        router.refresh();
      } else {
        toast({
          title: "Error submitting products",
          description: result?.error || "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting products for approval:", error);
      toast({
        title: "Error submitting products",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // View all submissions
  const handleViewAllSubmissions = () => {
    router.push(`${base}/dashboard/products/submissions`);
  };

  // Status badges for products
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500">Published</Badge>;
      case "ready":
        return <Badge className="bg-blue-500">Ready</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "draft":
        return <Badge className="bg-gray-500">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Status icon for products
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "ready":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "draft":
        return <FileText className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Handle search query
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search params
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }

    router.push(`${base}/dashboard/products?${params.toString()}`);
  };

  // Handle filter change
  const handleFilterChange = (value: string) => {
    setFilter(value);
    // Update URL with filter params
    const params = new URLSearchParams(searchParams.toString());

    if (value !== "all") {
      params.set("status", value);
    } else {
      params.delete("status");
    }

    router.push(`${base}/dashboard/products?${params.toString()}`);
  };

  const selectedCount = Object.values(selectedProducts).filter(Boolean).length;

  // Determine if user can add new products based on subscription
  const canAddNewProducts = () => {
    if (userPermissions.canCreateOwnProducts) {
      // Check if user has hit product limit
      if (userPermissions.productLimit !== null) {
        return drafts.length < userPermissions.productLimit;
      }
      return true;
    }
    return false;
  };

  // Check if user can create blanks based on subscription
  const canCreateBlanks = () => {
    return userPermissions.canSelectBlanks;
  };

  // Toggle view between list and grid
  const toggleView = (view: ViewType) => {
    setViewType(view);
  };

  // Check if a product can be selected (only drafts)
  const canSelectProduct = (product: Product) => {
    return product.status === "draft";
  };

  // Check if a product can be edited (only drafts)
  const canEditProduct = (product: Product) => {
    return product.status === "draft";
  };

  const getFilteredProducts = useMemo(() => {
    if (filter === "all") {
      return products;
    } else if (filter === "draft") {
      return drafts;
    } else {
      // For other status views, filter the products by status
      return products.filter((p) => p.status === filter);
    }
  }, [filter, products, drafts]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Products
          </h1>
          <p className="text-muted-foreground">
            Manage your product catalog and inventory
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Sheet
            open={isSubmissionSheetOpen}
            onOpenChange={setIsSubmissionSheetOpen}
          >
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Manage Submissions</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Create Submission</SheetTitle>
                <SheetDescription>
                  Select products to include in this submission
                </SheetDescription>
              </SheetHeader>

              <div className="py-6 space-y-4">
                <Button asChild>
                  <Link href={`${base}/dashboard/products/submissions`}>
                    View All Submissions
                  </Link>
                </Button>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Submission Name</label>
                  <Input
                    placeholder="e.g. Summer Collection 2025"
                    value={submissionName}
                    onChange={(e) => setSubmissionName(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional: Give your submission a name for easier
                    identification
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Available Drafts</h4>

                  {drafts.length === 0 ? (
                    <div className="text-center py-8 border rounded-lg">
                      <FileQuestion className="h-12 w-12 mx-auto text-gray-400" />
                      <p className="mt-2 text-muted-foreground">
                        No draft products available
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={handleCreateProduct}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create a Product
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                      {drafts.map((draft) => (
                        <div
                          key={draft._id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={!!selectedProducts[draft._id]}
                              onCheckedChange={(checked) =>
                                handleProductSelect(draft._id, checked === true)
                              }
                              id={`draft-${draft._id}`}
                              disabled={draft.status !== "draft"}
                            />
                            <div>
                              <label
                                htmlFor={`draft-${draft._id}`}
                                className="font-medium cursor-pointer"
                              >
                                {draft.name || "Untitled Product"}
                              </label>
                              <p className="text-xs text-muted-foreground">
                                {draft.category?.name || "Uncategorized"} •{" "}
                                {draft.variants?.length || 0} variants
                              </p>
                            </div>
                          </div>

                          {draft.status === "draft" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleProductAction(draft._id, "edit")
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">Cancel</Button>
                </SheetClose>
                <Button
                  onClick={() => {
                    setIsSubmissionSheetOpen(false);
                    setIsSubmitDialogOpen(true);
                  }}
                  disabled={selectedCount === 0}
                >
                  Create Submission ({selectedCount})
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <div className="flex gap-2">
            {user?.businessType === "reseller-internal" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleCreateProduct}
                      className="gap-1"
                      size="sm"
                      disabled={!canAddNewProducts()}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Create Product</span>
                    </Button>
                  </TooltipTrigger>
                  {!canAddNewProducts() && (
                    <TooltipContent>
                      <p>
                        You&apos;ve reached your product limit. Please upgrade
                        your plan to add more products.
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleBrowseBlanks}
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    disabled={!canCreateBlanks()}
                  >
                    <Package className="h-4 w-4" />
                    <span className="hidden sm:inline">Browse Blanks</span>
                  </Button>
                </TooltipTrigger>
                {!canCreateBlanks() && (
                  <TooltipContent>
                    <p>
                      You don&apos;t have access to blanks. Please upgrade your
                      plan to access this feature.
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <Tabs
        defaultValue={filter}
        onValueChange={handleFilterChange}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <TabsList
            className="md:mb-6 flex w-full overflow-x-auto whitespace-nowrap scrollbar-hide gap-2 px-1"
            style={{
              scrollSnapType: "x mandatory",
              justifyContent: "flex-start",
            }}
          >
            <TabsTrigger
              className="flex-shrink-0 min-w-max scroll-snap-start"
              value="all"
            >
              All Products
            </TabsTrigger>
            <TabsTrigger
              className="flex-shrink-0 min-w-max scroll-snap-start"
              value="published"
            >
              Published
            </TabsTrigger>
            <TabsTrigger
              className="flex-shrink-0 min-w-max scroll-snap-start"
              value="ready"
            >
              Ready
            </TabsTrigger>
            <TabsTrigger
              className="flex-shrink-0 min-w-max scroll-snap-start"
              value="pending"
            >
              Pending
            </TabsTrigger>
            <TabsTrigger
              className="flex-shrink-0 min-w-max scroll-snap-start"
              value="draft"
            >
              Drafts
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            {selectedCount > 0 && (
              <Button
                size="sm"
                onClick={() => setIsSubmitDialogOpen(true)}
                className="gap-1"
              >
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Submit</span> (
                {selectedCount})
              </Button>
            )}

            {/* View toggle buttons */}
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewType === "list" ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => toggleView("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewType === "grid" ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => toggleView("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="sm:hidden"
          >
            Search
          </Button>

          <Select value={filter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="pending">Pending Approval</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
            </SelectContent>
          </Select>
        </form>

        <TabsContent value="all" className="mt-0">
          {viewType === "grid" ? (
            <ProductGrid
              products={getFilteredProducts}
              isLoading={isLoading}
              onProductAction={handleProductAction}
              onProductSelect={handleProductSelect}
              selectedProducts={selectedProducts}
              getStatusBadge={getStatusBadge}
              getStatusIcon={getStatusIcon}
              canSelectProduct={canSelectProduct}
              canEditProduct={canEditProduct}
              emptyState={{
                title: "No products yet",
                description: "Start by creating a product or browsing blanks",
                actions: (
                  <div className="mt-6 flex gap-4 justify-center">
                    {user?.businessType === "reseller-internal" && (
                      <Button onClick={handleCreateProduct}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Product
                      </Button>
                    )}
                    <Button variant="outline" onClick={handleBrowseBlanks}>
                      <Package className="h-4 w-4 mr-2" />
                      Browse Blanks
                    </Button>
                  </div>
                ),
              }}
            />
          ) : (
            <ProductList
              products={getFilteredProducts}
              isLoading={isLoading}
              onProductAction={handleProductAction}
              onProductSelect={handleProductSelect}
              selectedProducts={selectedProducts}
              getStatusBadge={getStatusBadge}
              getStatusIcon={getStatusIcon}
              canSelectProduct={canSelectProduct}
              canEditProduct={canEditProduct}
              emptyState={{
                title: "No products yet",
                description: "Start by creating a product or browsing blanks",
                actions: (
                  <div className="mt-6 flex gap-4 justify-center">
                    {user?.businessType === "reseller-internal" && (
                      <Button onClick={handleCreateProduct}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Product
                      </Button>
                    )}
                    <Button variant="outline" onClick={handleBrowseBlanks}>
                      <Package className="h-4 w-4 mr-2" />
                      Browse Blanks
                    </Button>
                  </div>
                ),
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="published" className="mt-0">
          {viewType === "grid" ? (
            <ProductGrid
              products={products.filter((p) => p.status === "published")}
              isLoading={isLoading}
              onProductAction={handleProductAction}
              onProductSelect={handleProductSelect}
              selectedProducts={selectedProducts}
              getStatusBadge={getStatusBadge}
              getStatusIcon={getStatusIcon}
              canSelectProduct={canSelectProduct}
              canEditProduct={canEditProduct}
              emptyState={{
                title: "No published products",
                description: "Your approved products will appear here",
              }}
            />
          ) : (
            <ProductList
              products={products.filter((p) => p.status === "published")}
              isLoading={isLoading}
              onProductAction={handleProductAction}
              onProductSelect={handleProductSelect}
              selectedProducts={selectedProducts}
              getStatusBadge={getStatusBadge}
              getStatusIcon={getStatusIcon}
              canSelectProduct={canSelectProduct}
              canEditProduct={canEditProduct}
              emptyState={{
                title: "No published products",
                description: "Your approved products will appear here",
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="ready" className="mt-0">
          {viewType === "grid" ? (
            <ProductGrid
              products={products.filter((p) => p.status === "ready")}
              isLoading={isLoading}
              onProductAction={handleProductAction}
              onProductSelect={handleProductSelect}
              selectedProducts={selectedProducts}
              getStatusBadge={getStatusBadge}
              getStatusIcon={getStatusIcon}
              canSelectProduct={canSelectProduct}
              canEditProduct={canEditProduct}
              emptyState={{
                title: "No ready products",
                description:
                  "Products approved and ready to be published will appear here",
              }}
            />
          ) : (
            <ProductList
              products={products.filter((p) => p.status === "ready")}
              isLoading={isLoading}
              onProductAction={handleProductAction}
              onProductSelect={handleProductSelect}
              selectedProducts={selectedProducts}
              getStatusBadge={getStatusBadge}
              getStatusIcon={getStatusIcon}
              canSelectProduct={canSelectProduct}
              canEditProduct={canEditProduct}
              emptyState={{
                title: "No ready products",
                description:
                  "Products approved and ready to be published will appear here",
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-0">
          {viewType === "grid" ? (
            <ProductGrid
              products={products.filter((p) => p.status === "pending")}
              isLoading={isLoading}
              onProductAction={handleProductAction}
              onProductSelect={handleProductSelect}
              selectedProducts={selectedProducts}
              getStatusBadge={getStatusBadge}
              getStatusIcon={getStatusIcon}
              canSelectProduct={canSelectProduct}
              canEditProduct={canEditProduct}
              emptyState={{
                title: "No pending products",
                description: "Products awaiting approval will appear here",
                actions: (
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={handleViewAllSubmissions}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View All Submissions
                  </Button>
                ),
              }}
            />
          ) : (
            <ProductList
              products={products.filter((p) => p.status === "pending")}
              isLoading={isLoading}
              onProductAction={handleProductAction}
              onProductSelect={handleProductSelect}
              selectedProducts={selectedProducts}
              getStatusBadge={getStatusBadge}
              getStatusIcon={getStatusIcon}
              canSelectProduct={canSelectProduct}
              canEditProduct={canEditProduct}
              emptyState={{
                title: "No pending products",
                description: "Products awaiting approval will appear here",
                actions: (
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={handleViewAllSubmissions}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View All Submissions
                  </Button>
                ),
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="draft" className="mt-0">
          {viewType === "grid" ? (
            <ProductGrid
              products={drafts} // Use drafts directly from the store
              isLoading={isLoading}
              onProductAction={handleProductAction}
              onProductSelect={handleProductSelect}
              selectedProducts={selectedProducts}
              getStatusBadge={getStatusBadge}
              getStatusIcon={getStatusIcon}
              canSelectProduct={(product) => product.status === "draft"}
              canEditProduct={(product) => product.status === "draft"}
              emptyState={{
                title: "No draft products",
                description: "Start creating products to see drafts here",
                actions: (
                  <div className="mt-6 flex gap-4 justify-center">
                    {user?.businessType === "reseller-internal" && (
                      <Button onClick={handleCreateProduct}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Product
                      </Button>
                    )}
                    <Button variant="outline" onClick={handleBrowseBlanks}>
                      <Package className="h-4 w-4 mr-2" />
                      Browse Blanks
                    </Button>
                  </div>
                ),
              }}
            />
          ) : (
            <ProductList
              products={drafts} // Use drafts directly from the store
              isLoading={isLoading}
              onProductAction={handleProductAction}
              onProductSelect={handleProductSelect}
              selectedProducts={selectedProducts}
              getStatusBadge={getStatusBadge}
              getStatusIcon={getStatusIcon}
              canSelectProduct={(product) => product.status === "draft"}
              canEditProduct={(product) => product.status === "draft"}
              emptyState={{
                title: "No draft products",
                description: "Start creating products to see drafts here",
                actions: (
                  <div className="mt-6 flex gap-4 justify-center">
                    {user?.businessType === "reseller-internal" && (
                      <Button onClick={handleCreateProduct}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Product
                      </Button>
                    )}
                    <Button variant="outline" onClick={handleBrowseBlanks}>
                      <Package className="h-4 w-4 mr-2" />
                      Browse Blanks
                    </Button>
                  </div>
                ),
              }}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Pagination controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newPage = Math.max(1, pagination.page - 1);
                setPageNumber(newPage);

                // Update URL params
                const params = new URLSearchParams(searchParams.toString());
                params.set("p", newPage.toString());
                router.push(`${base}/dashboard/products?${params.toString()}` , {
                  scroll: false, // Prevent page from scrolling to top on param change
                });
              }}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newPage = Math.min(
                  pagination.totalPages,
                  pagination.page + 1
                );
                setPageNumber(newPage);

                // Update URL params
                const params = new URLSearchParams(searchParams.toString());
                params.set("p", newPage.toString());
                router.push(`${base}/dashboard/products?${params.toString()}` , {
                  scroll: false, // Prevent page from scrolling to top on param change
                });
              }}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Submission dialog */}
      <AlertDialog
        open={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Products for Approval</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to submit {selectedCount} product(s) for approval.
              This will change their status to &quot;pending&quot; until they
              are reviewed by an administrator.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Submission Name</label>
              <Input
                placeholder="e.g. Summer Collection 2025"
                value={submissionName}
                onChange={(e) => setSubmissionName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Optional: Give your submission a name for easier identification
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message (Optional)</label>
              <Input
                placeholder="Any notes for the reviewer"
                value={submissionMessage}
                onChange={(e) => setSubmissionMessage(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Add any notes or comments for the approval team
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleSubmitForApproval();
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner />
                  Submitting...
                </>
              ) : (
                "Submit for Approval"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Extracted ProductGrid component for reuse
function ProductGrid({
  products,
  isLoading,
  onProductAction,
  onProductSelect,
  selectedProducts,
  getStatusBadge,
  getStatusIcon,
  canSelectProduct,
  canEditProduct,
  emptyState,
}: {
  products: Product[];
  isLoading: boolean;
  onProductAction: (id: string, action: string) => void;
  onProductSelect: (id: string, selected: boolean) => void;
  selectedProducts: Record<string, boolean>;
  getStatusBadge: (status: string) => React.ReactNode;
  getStatusIcon: (status: string) => React.ReactNode;
  canSelectProduct: (product: Product) => boolean;
  canEditProduct: (product: Product) => boolean;
  emptyState: {
    title: string;
    description: string;
    actions?: React.ReactNode;
  };
}) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState({
    open: false,
    productId: "",
  });
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg" />
            <CardContent className="p-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <Package className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-4 text-lg font-medium">{emptyState.title}</h3>
        <p className="mt-2 text-muted-foreground">{emptyState.description}</p>
        {emptyState.actions}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4 border-b flex justify-between items-center">
                <CardTitle className="text-lg capitalize truncate max-w-[70%]">
                  {product.name || "Untitled Product"}
                </CardTitle>
                {canSelectProduct(product) ? (
                  <Checkbox
                    checked={!!selectedProducts[product._id]}
                    onCheckedChange={(checked) =>
                      onProductSelect(product._id, checked === true)
                    }
                  />
                ) : (
                  getStatusIcon(product.status || "draft")
                )}
              </div>
              <div className="aspect-[4/3] relative bg-gray-100">
                {product.variants &&
                product.variants.length > 0 &&
                product.variants[0].gallery &&
                product.variants[0].gallery.length > 0 ? (
                  <Image
                    width={800}
                    height={800}
                    src={product.variants[0].gallery[0].url}
                    alt={product.name || "Product"}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <Package className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {getStatusBadge(product.status || "draft")}
                </div>
              </div>

              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {product.description || "No description available"}
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {product.category?.name || "Uncategorized"}
                  </Badge>

                  <Badge variant="outline" className="text-xs capitalize">
                    <Truck className="h-3 w-3 mr-1" />
                    {product.mode || "standard"}
                  </Badge>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <p className="font-semibold">
                    {product.basePrice?.value
                      ? new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: product.basePrice.currency || "NGN",
                        }).format(Number(product.basePrice.value))
                      : "Price not set"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {product.variants?.length || 0} variants
                  </p>
                </div>
              </CardContent>

              <CardFooter className="bg-gray-50 p-4 flex gap-2">
                {canEditProduct(product) ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onProductAction(product._id, "edit")}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onProductAction(product._id, "view")}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    View
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() =>
                    setOpenDeleteDialog({
                      open: true,
                      productId: product._id,
                    })
                  }
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      <AlertDialog
        open={openDeleteDialog.open}
        onOpenChange={(setOpen) => {
          setOpenDeleteDialog({ open: setOpen, productId: "" });
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              product and remove your product data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-700"
              onClick={() =>
                onProductAction(openDeleteDialog.productId, "delete")
              }
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// List view component with fixed layout
function ProductList({
  products,
  isLoading,
  onProductAction,
  onProductSelect,
  selectedProducts,
  getStatusBadge,
  getStatusIcon,
  canSelectProduct,
  canEditProduct,
  emptyState,
}: {
  products: Product[];
  isLoading: boolean;
  onProductAction: (id: string, action: string) => void;
  onProductSelect: (id: string, selected: boolean) => void;
  selectedProducts: Record<string, boolean>;
  getStatusBadge: (status: string) => React.ReactNode;
  getStatusIcon: (status: string) => React.ReactNode;
  canSelectProduct: (product: Product) => boolean;
  canEditProduct: (product: Product) => boolean;
  emptyState: {
    title: string;
    description: string;
    actions?: React.ReactNode;
  };
}) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState({
    open: false,
    productId: "",
  });
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border rounded-lg p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <Package className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-4 text-lg font-medium">{emptyState.title}</h3>
        <p className="mt-2 text-muted-foreground">{emptyState.description}</p>
        {emptyState.actions}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {/* Desktop Table Header */}
        <div className="hidden md:flex bg-gray-50 rounded-t-lg p-3 font-medium text-sm">
          <div className="w-[5%]"></div>
          <div className="w-[35%]">Product</div>
          <div className="w-[15%]">Category</div>
          <div className="w-[10%]">Status</div>
          <div className="w-[15%]">Price</div>
          <div className="w-[10%]">Variants</div>
          <div className="w-[10%] text-right">Actions</div>
        </div>

        {products.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="overflow-hidden">
              {/* Mobile View */}
              <div className="p-4 md:hidden">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {canSelectProduct(product) ? (
                      <Checkbox
                        checked={!!selectedProducts[product._id]}
                        onCheckedChange={(checked) =>
                          onProductSelect(product._id, checked === true)
                        }
                      />
                    ) : (
                      getStatusIcon(product.status || "draft")
                    )}
                    <div>
                      <h3 className="font-medium capitalize truncate max-w-[180px]">
                        {product.name || "Untitled Product"}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {product.category?.name || "Uncategorized"}
                        </Badge>
                        {getStatusBadge(product.status || "draft")}
                      </div>
                    </div>
                  </div>

                  <p className="font-semibold text-right">
                    {product.basePrice?.value
                      ? new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: product.basePrice.currency || "NGN",
                        }).format(Number(product.basePrice.value))
                      : "—"}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    {product.variants?.length || 0} variant(s)
                  </p>

                  <div className="flex gap-2">
                    {canEditProduct(product) ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onProductAction(product._id, "edit")}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onProductAction(product._id, "view")}
                        className="h-8 w-8 p-0"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                      onClick={() =>
                        setOpenDeleteDialog({
                          open: true,
                          productId: product._id,
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Desktop View with fixed layout using percentage widths */}
              <div className="hidden md:flex items-center p-4">
                <div className="w-[5%]">
                  {canSelectProduct(product) ? (
                    <Checkbox
                      checked={!!selectedProducts[product._id]}
                      onCheckedChange={(checked) =>
                        onProductSelect(product._id, checked === true)
                      }
                    />
                  ) : (
                    getStatusIcon(product.status || "draft")
                  )}
                </div>

                <div className="w-[35%]">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                      {product.variants &&
                      product.variants.length > 0 &&
                      product.variants[0].gallery &&
                      product.variants[0].gallery.length > 0 ? (
                        <Image
                          width={800}
                          height={800}
                          src={product.variants[0].gallery[0].url}
                          alt={product.name || "Product"}
                          className="object-cover w-full h-full rounded"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div className="max-w-[200px]">
                      <h3 className="font-medium capitalize truncate">
                        {product.name || "Untitled Product"}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {product.code || "No code"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-[15%]">
                  <Badge variant="outline" className="text-xs">
                    {product.category?.name || "Uncategorized"}
                  </Badge>
                </div>

                <div className="w-[10%]">
                  {getStatusBadge(product.status || "draft")}
                </div>

                <div className="w-[15%]">
                  <p className="font-semibold">
                    {product.basePrice?.value
                      ? new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: product.basePrice.currency || "NGN",
                        }).format(Number(product.basePrice.value))
                      : "—"}
                  </p>
                </div>

                <div className="w-[10%]">
                  <p className="text-sm">{product.variants?.length || 0}</p>
                </div>

                <div className="w-[10%] flex justify-end gap-1">
                  {canEditProduct(product) ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onProductAction(product._id, "edit")}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onProductAction(product._id, "view")}
                      className="h-8 w-8 p-0"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                    onClick={() =>
                      setOpenDeleteDialog({
                        open: true,
                        productId: product._id,
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      <AlertDialog
        open={openDeleteDialog.open}
        onOpenChange={(setOpen) => {
          setOpenDeleteDialog({ open: setOpen, productId: "" });
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              product and remove your product data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-700"
              onClick={() =>
                onProductAction(openDeleteDialog.productId, "delete")
              }
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
