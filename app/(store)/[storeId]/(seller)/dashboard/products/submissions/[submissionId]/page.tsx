// submission-detail-page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  Info,
  Loader2,
  MessageSquare,
  Package2,
  RefreshCw,
  Send,
  UserCircle,
  XCircle,
} from "lucide-react";

import { submissionApi } from "@/lib/api/submissions";
import { useProductStore } from "@/store/product-store";
import { SubmissionDetailSkeleton } from "@/components/skeletons/submission-detail-skeleton";
import Image from "next/image";

interface Message {
  _id: string;
  text: string;
  senderType: "seller" | "admin" | "system";
  createdAt: string;
  attachments?: {
    type: string;
    url: string;
    name: string;
  }[];
}

export default function SubmissionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const storeId = params.storeId as string;
  const isPathBased = pathname?.startsWith(`/${storeId}`);
  const base = isPathBased ? `/${storeId}` : "";
  const submissionId = params.submissionId as string;
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [submission, setSubmission] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read when chat tab is active
  useEffect(() => {
    if (
      activeTab === "chat" &&
      submissionId &&
      submission?.status !== "draft"
    ) {
      submissionApi.markMessagesAsRead(submissionId).catch((error) => {
        console.error("Error marking messages as read:", error);
      });
    }
  }, [activeTab, submissionId, submission?.status]);

  // Load submission and products
  useEffect(() => {
    const loadSubmission = async () => {
      setIsLoading(true);
      try {
        // Load from API
        const response = await submissionApi.getSubmission(submissionId);

        const foundSubmission = response;
        setSubmission(foundSubmission);

        // Get associated products
        const items = foundSubmission?.items || [];

        setProducts(items);

        // Get submission messages
        if (foundSubmission?.status !== "draft") {
          const messagesResponse = await submissionApi.getMessages(
            submissionId
          );
          setMessages(messagesResponse?.results || []);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Failed to load submission:", error);
        toast({
          title: "Error",
          description: "Failed to load submission details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSubmission();
  }, [submissionId, toast]);

  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSendingMessage) return;

    setIsSendingMessage(true);

    try {
      // For draft submissions, we don't send messages
      if (submission.status === "draft") {
        toast({
          title: "Cannot send message",
          description: "You cannot send messages for draft submissions",
          variant: "destructive",
        });
        return;
      }

      // Send message to API
      const response = await submissionApi.sendMessage(
        submissionId,
        newMessage
      );

      // Add the new message to the UI
      const newMessageObj: Message = {
        _id: response.data?._id || `temp-${Date.now()}`,
        text: newMessage,
        senderType: "seller",
        createdAt: new Date().toISOString(),
      };

      setMessages([...messages, newMessageObj]);
      setNewMessage("");

      // Optional: Refresh messages from server to ensure consistency
      const messagesResponse = await submissionApi.getMessages(submissionId);
      setMessages(messagesResponse.results || []);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Go back to submissions list
  const handleBack = () => {
    router.push(`${base}/dashboard/products/submissions`);
  };

  // Edit and resubmit products (for rejected submissions)
  const handleResubmit = async () => {
    setIsResubmitting(true);

    try {
      // Call the API to resubmit
      const response = await submissionApi.resubmitSubmission(
        submissionId,
        "Submission updated and resubmitted for review."
      );

      if (response.status === "ok") {
        // Update the local submission state
        setSubmission(response.data);

        // Refresh messages to include the system message
        const messagesResponse = await submissionApi.getMessages(submissionId);
        setMessages(messagesResponse.data.results || []);

        toast({
          title: "Submission resubmitted",
          description: "Your submission has been resubmitted for review",
        });
      }
    } catch (error) {
      console.error("Error resubmitting:", error);
      toast({
        title: "Error",
        description: "Failed to resubmit submission",
        variant: "destructive",
      });
    } finally {
      setIsResubmitting(false);
    }
  };

  // Format date
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  if (isLoading) {
    return <SubmissionDetailSkeleton />;
  }

  if (!submission) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 mx-auto text-gray-400" />
        <h2 className="mt-4 text-lg font-medium">Submission Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          The submission you&apos;re looking for doesn&apos;t exist or has been
          removed
        </p>
        <Button variant="outline" className="mt-6" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Submissions
        </Button>
      </div>
    );
  }

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
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {submission.name || `Submission ${submission._id.slice(0, 8)}`}
              </h1>
              {getStatusBadge(submission.status)}
            </div>
            <p className="text-muted-foreground">
              Submitted {formatDate(submission.initiated.initiatedAt)}
            </p>
          </div>
        </div>

        {submission.status === "rejected" && (
          <Button onClick={handleResubmit} disabled={isResubmitting}>
            {isResubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resubmitting...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Edit & Resubmit
              </>
            )}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">
                Products ({products.length})
              </TabsTrigger>
              {submission.status !== "draft" && (
                <TabsTrigger value="chat" className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Chat
                  {submission.unreadCount?.seller > 0 && (
                    <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center">
                      {submission.unreadCount.seller}
                    </span>
                  )}
                </TabsTrigger>
              )}
            </TabsList>

            <div className="mt-6">
              <TabsContent value="overview" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Submission Details</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Submission ID
                        </h3>
                        <p>{submission._id}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Status
                        </h3>
                        <div className="flex items-center mt-1">
                          {submission.status === "pending" && (
                            <>
                              <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                              <span>Pending Review</span>
                            </>
                          )}

                          {submission.status === "approved" && (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                              <span>Approved</span>
                            </>
                          )}

                          {submission.status === "rejected" && (
                            <>
                              <XCircle className="h-4 w-4 text-red-500 mr-2" />
                              <span>Rejected</span>
                            </>
                          )}

                          {submission.status === "draft" && (
                            <>
                              <FileText className="h-4 w-4 text-gray-500 mr-2" />
                              <span>Draft</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Submission Type
                        </h3>
                        <p className="capitalize">
                          {submission.category} Products
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Date Submitted
                        </h3>
                        <p>{formatDate(submission.initiated.initiatedAt)}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Products
                        </h3>
                        <p>{products.length} products in this submission</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-3">Status Updates</h3>

                      <div className="space-y-4">
                        {submission.updates && submission.updates.length > 0 ? (
                          <div className="space-y-4">
                            {submission.updates.map(
                              (update: any, index: number) => (
                                <div
                                  key={index}
                                  className={`p-4 rounded-lg border ${update.action === "approve"
                                      ? "bg-green-50 border-green-100"
                                      : update.action === "reject"
                                        ? "bg-red-50 border-red-100"
                                        : "bg-gray-50 border-gray-100"
                                    }`}
                                >
                                  <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-0.5">
                                      {update.action === "approve" && (
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                      )}

                                      {update.action === "reject" && (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                      )}

                                      {!update.action && (
                                        <Info className="h-5 w-5 text-blue-500" />
                                      )}
                                    </div>

                                    <div className="ml-3">
                                      <p className="text-sm font-medium">
                                        {update.action === "approve"
                                          ? "Submission Approved"
                                          : update.action === "reject"
                                            ? "Submission Rejected"
                                            : "Status Update"}
                                      </p>

                                      <p className="mt-1 text-sm">
                                        {update.message}
                                      </p>

                                      <p className="mt-1 text-xs text-muted-foreground">
                                        {formatDate(
                                          update.updatedAt || update.timestamp
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No status updates yet
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="products" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Products in Submission</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {products.map((product, index) => (
                        <Card key={index} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/3 h-48 bg-gray-100 relative">
                              {product.variants &&
                                product.variants[0]?.gallery?.[0]?.url ? (
                                <Image
                                  width={800}
                                  height={800}
                                  src={product.variants[0].gallery[0].url}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Package2 className="h-12 w-12 text-gray-400" />
                                </div>
                              )}

                              {/* Status indicator */}
                              <div className="absolute top-2 right-2">
                                {getStatusBadge(product.status)}
                              </div>
                            </div>

                            <div className="p-4 flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-lg">
                                    {product.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    Code: {product.code}
                                  </p>
                                </div>

                                {submission.status === "rejected" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1"
                                    onClick={() => {
                                  router.push(
                                        `${base}/dashboard/products/edit/${product._id}`
                                      );
                                    }}
                                  >
                                    <RefreshCw className="h-4 w-4" />
                                    Edit
                                  </Button>
                                )}
                              </div>

                              <p className="mt-2 line-clamp-2">
                                {product.description}
                              </p>

                              {product.variants &&
                                product.variants.length > 0 && (
                                  <div className="mt-4">
                                    <h4 className="text-sm font-medium mb-2">
                                      Variants
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {product.variants.map(
                                        (variant: any, vIndex: number) => (
                                          <div
                                            key={vIndex}
                                            className="flex items-center p-2 bg-gray-50 rounded-md border text-sm"
                                          >
                                            <div
                                              className="h-3 w-3 rounded-full mr-2"
                                              style={{
                                                backgroundColor:
                                                  variant.color?.hex ||
                                                  "#000000",
                                              }}
                                            />
                                            <span>
                                              {variant.size?.displayName ||
                                                "N/A"}{" "}
                                              / {variant.color?.name || "N/A"}
                                            </span>
                                            <span className="mx-2">•</span>
                                            <span>
                                              {"-"} units
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}

                              <div className="mt-4 flex justify-between items-center">
                                <div>
                                  <span className="text-sm font-medium">
                                    Base Price:
                                  </span>
                                  <span className="ml-2">
                                    {new Intl.NumberFormat("en-NG", {
                                      style: "currency",
                                      currency: product.basePrice.currency,
                                    }).format(Number(product.basePrice.value))}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {submission.status !== "draft" && (
                <TabsContent value="chat" className="m-0">
                  <Card className="h-[calc(100vh-240px)] flex flex-col">
                    <CardHeader className="px-6 py-4 border-b">
                      <CardTitle className="text-lg">Submission Chat</CardTitle>
                      <CardDescription>
                        Communicate with our review team about your submission
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-0 flex-1 overflow-auto">
                      <div className="p-6 space-y-6">
                        {messages.length > 0 ? (
                          messages.map((message, index) => (
                            <div
                              key={index}
                              className={`flex ${message.senderType === "seller"
                                  ? "justify-end"
                                  : "justify-start"
                                }`}
                            >
                              <div
                                className={`max-w-md rounded-lg p-4 ${message.senderType === "seller"
                                    ? "bg-primary text-primary-foreground ml-12"
                                    : message.senderType === "system"
                                      ? "bg-gray-200 mx-auto"
                                      : "bg-gray-100 mr-12"
                                  }`}
                              >
                                <div className="flex items-center mb-2">
                                  {message.senderType === "admin" && (
                                    <UserCircle className="h-5 w-5 mr-2 text-gray-500" />
                                  )}

                                  <span className="text-sm font-medium text-white">
                                    {message.senderType === "seller"
                                      ? "You"
                                      : message.senderType === "system"
                                        ? "System"
                                        : "Support Team"}
                                  </span>

                                  {message.senderType === "seller" && (
                                    <UserCircle className="h-5 w-5 ml-2 text-white" />
                                  )}
                                </div>

                                <p
                                  className={`text-sm ${message.senderType === "seller"
                                      ? "text-white"
                                      : ""
                                    }`}
                                >
                                  {message.text}
                                </p>

                                {message.attachments &&
                                  message.attachments.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                      {message.attachments.map(
                                        (attachment, attIndex) => (
                                          <a
                                            key={attIndex}
                                            href={attachment.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center text-xs p-2 rounded ${message.senderType === "seller"
                                                ? "bg-primary-foreground/10"
                                                : "bg-white"
                                              }`}
                                          >
                                            <FileText className="h-4 w-4 mr-2" />
                                            <span>{attachment.name}</span>
                                          </a>
                                        )
                                      )}
                                    </div>
                                  )}

                                <p
                                  className={`text-xs mt-1 ${message.senderType === "seller"
                                      ? "text-primary-foreground/80"
                                      : "text-gray-500"
                                    }`}
                                >
                                  {formatDate(message.createdAt)}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <MessageSquare className="h-12 w-12 mx-auto text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium">
                              No Messages Yet
                            </h3>
                            <p className="mt-2 text-muted-foreground">
                              Start a conversation with our review team
                            </p>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 border-t mt-auto">
                      {submission.status !== "approved" ? (
                        <div className="w-full flex items-center gap-2">
                          <Input
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || isSendingMessage}
                          >
                            {isSendingMessage ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="w-full text-center p-2 bg-gray-100 rounded-md">
                          <p className="text-sm text-muted-foreground">
                            This submission has been approved and the chat is
                            now closed
                          </p>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                </TabsContent>
              )}
            </div>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Submission Status</CardTitle>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              <div className="space-y-6">
                <div>
                  {submission.status === "pending" && (
                    <div className="rounded-md bg-yellow-50 p-4 border border-yellow-100">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Clock className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">
                            Under Review
                          </h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <p>
                              Your submission is being reviewed by our team.
                              This typically takes 2-3 business days.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {submission.status === "approved" && (
                    <div className="rounded-md bg-green-50 p-4 border border-green-100">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">
                            Approved
                          </h3>
                          <div className="mt-2 text-sm text-green-700">
                            <p>
                              Your submission has been approved! The products
                              are now active in your store.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {submission.status === "rejected" && (
                    <div className="rounded-md bg-red-50 p-4 border border-red-100">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <XCircle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            Changes Needed
                          </h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>
                              Your submission requires some changes before it
                              can be approved. Please check the chat for
                              details.
                            </p>
                          </div>
                          <div className="mt-4">
                            <Button
                              onClick={handleResubmit}
                              disabled={isResubmitting}
                              className="w-full"
                            >
                              {isResubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Resubmitting...
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Edit & Resubmit
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {submission.status === "draft" && (
                    <div className="rounded-md bg-gray-50 p-4 border border-gray-100">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FileText className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-800">
                            Draft
                          </h3>
                          <div className="mt-2 text-sm text-gray-700">
                            <p>
                              This submission is currently saved as a draft.
                              Submit it when you&apos;re ready for review.
                            </p>
                          </div>
                          <div className="mt-4">
                            <Button
                              onClick={() => {
                                // Here you would call the API to submit the draft
                                toast({
                                  title: "Submitting...",
                                  description:
                                    "Your submission is being processed",
                                });

                                // Simulate submission
                                setTimeout(() => {
                                  const updatedSubmission = {
                                    ...submission,
                                    status: "pending",
                                  };
                                  setSubmission(updatedSubmission);

                                  toast({
                                    title: "Submitted successfully",
                                    description:
                                      "Your submission is now pending review",
                                  });
                                }, 1500);
                              }}
                              className="w-full"
                            >
                              Submit for Review
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Timeline</h3>

                  <ol className="relative border-l border-gray-200 ml-3 space-y-6">
                    <li className="mb-6 ml-6">
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 ring-8 ring-white">
                        <FileText className="w-3 h-3 text-primary-foreground" />
                      </span>
                      <h3 className="flex items-center mb-1 text-sm font-medium">
                        Submission Created
                      </h3>
                      <time className="block text-xs font-normal text-gray-500">
                        {formatDate(submission.initiated.initiatedAt)}
                      </time>
                    </li>

                    {submission.updates &&
                      submission.updates.map((update: any, index: number) => (
                        <li key={index} className="mb-6 ml-6">
                          <span
                            className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white ${update.action === "approve"
                                ? "bg-green-500"
                                : update.action === "reject"
                                  ? "bg-red-500"
                                  : "bg-blue-500"
                              }`}
                          >
                            {update.action === "approve" && (
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            )}

                            {update.action === "reject" && (
                              <XCircle className="w-3 h-3 text-white" />
                            )}

                            {!update.action && (
                              <Info className="w-3 h-3 text-white" />
                            )}
                          </span>
                          <h3 className="flex items-center mb-1 text-sm font-medium">
                            {update.action === "approve"
                              ? "Submission Approved"
                              : update.action === "reject"
                                ? "Changes Requested"
                                : "Status Update"}
                          </h3>
                          <time className="block text-xs font-normal text-gray-500">
                            {formatDate(update.updatedAt || update.timestamp)}
                          </time>
                          <p className="text-sm mt-1">{update.message}</p>
                        </li>
                      ))}
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          {submission.status !== "draft" && (
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Need Help?</CardTitle>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                <div className="space-y-4 text-sm">
                  <div className="flex items-start">
                    <Info className="h-4 w-4 mt-0.5 mr-2 text-blue-500" />
                    <p>
                      If you have questions about your submission, you can use
                      the chat to communicate with our review team.
                    </p>
                  </div>

                  <div className="flex items-start">
                    <Info className="h-4 w-4 mt-0.5 mr-2 text-blue-500" />
                    <p>
                      Most submissions are processed within 2-3 business days.
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => setActiveTab("chat")}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Go to Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
