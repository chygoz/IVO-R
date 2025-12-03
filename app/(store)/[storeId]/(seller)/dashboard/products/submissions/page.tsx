"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  XCircle,
} from "lucide-react";

import { submissionApi } from "@/lib/api/submissions";
import { useProductStore } from "@/store/product-store";
import { SubmissionsPageSkeleton } from "@/components/skeletons/submissions-page-skeleton";

export default function SubmissionsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams() as { storeId?: string };
  const storeId = params.storeId;
  const isPathBased = pathname?.startsWith(`/${storeId}`);
  const base = isPathBased ? `/${storeId}` : "";
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);

  // Load submissions from API
  useEffect(() => {
    const loadSubmissions = async () => {
      setIsLoading(true);
      try {
        let apiSubmissions = [];

        // Get submissions from API
        const status = activeTab !== "all" ? activeTab : undefined;
        const response = await submissionApi.getMySubmissions(status);
        apiSubmissions = response.results;

        // Include draft submissions from store
        let allSubmissions = apiSubmissions;

        // Apply search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          allSubmissions = allSubmissions.filter(
            (sub: any) =>
              sub.name?.toLowerCase().includes(query) ||
              sub._id.toLowerCase().includes(query)
          );
        }

        // Sort by initiated date (newest first)
        allSubmissions.sort(
          (a: any, b: any) =>
            new Date(b.initiated.initiatedAt).getTime() -
            new Date(a.initiated.initiatedAt).getTime()
        );

        setSubmissions(allSubmissions);
      } catch (error) {
        console.error("Failed to load submissions:", error);
        toast({
          title: "Error",
          description: "Failed to load submissions",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSubmissions();
  }, [activeTab, searchQuery, toast]);

  // View submission details
  const handleViewSubmission = (submissionId: string) => {
    router.push(`${base}/dashboard/products/submissions/${submissionId}`);
  };

  // Go back to products
  const handleBack = () => {
    router.push(`${base}/dashboard/products`);
  };

  // Format date to relative time (e.g., "2 days ago")
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000)
      return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="bg-gray-100">
            Draft
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Delete draft submission
  const handleDeleteDraft = async (submissionId: string) => {
    try {
      // // If it's a draft in our local store, use the store method
      // if (draftSubmissions.some((s) => s._id === submissionId)) {
      //   useProductStore.getState().deleteDraftSubmission(submissionId);
      // }

      toast({
        title: "Submission deleted",
        description: "Your draft submission has been deleted",
      });
    } catch (error) {
      console.error("Error deleting draft:", error);
      toast({
        title: "Error",
        description: "Failed to delete draft submission",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Product Submissions
            </h1>
            <p className="text-muted-foreground">
              Manage your product submissions and track their status
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full md:w-auto"
          >
            <TabsList className="grid w-full md:w-auto grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search submissions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <SubmissionsPageSkeleton />
        ) : submissions.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <FileText className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">No Submissions Found</h3>
            <p className="mt-2 text-muted-foreground">
              {activeTab === "all"
                ? "You haven't made any product submissions yet"
                : `You don't have any ${activeTab} submissions`}
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => router.push(`${base}/dashboard/products/create`)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Product
            </Button>
          </div>
        ) : (
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle>Submission History</CardTitle>
              <CardDescription>
                {submissions.length}{" "}
                {submissions.length === 1 ? "submission" : "submissions"} found
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Submission</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission._id}>
                      <TableCell className="font-medium">
                        {submission.name ||
                          `Submission ${submission._id.slice(0, 6)}`}
                      </TableCell>
                      <TableCell>{submission.items.length} products</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatRelativeTime(submission.initiated.initiatedAt)}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewSubmission(submission._id)}
                            className="gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only">View</span>
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleViewSubmission(submission._id)
                                }
                              >
                                View Details
                              </DropdownMenuItem>

                              {submission.status === "rejected" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(
                                      `${base}/dashboard/products/submissions/${submission._id}/edit`
                                    )
                                  }
                                >
                                  Edit & Resubmit
                                </DropdownMenuItem>
                              )}

                              {submission.status === "draft" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeleteDraft(submission._id)
                                  }
                                  className="text-red-600"
                                >
                                  Delete Draft
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
