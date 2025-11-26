"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MessageSquare, Info } from "lucide-react";

export function SubmissionDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="mr-4" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                <Skeleton className="h-8 w-56" />
              </h1>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
        </div>

        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview" disabled>
                Overview
              </TabsTrigger>
              <TabsTrigger value="products" disabled>
                Products
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                disabled
                className="flex items-center gap-1"
              >
                <MessageSquare className="h-4 w-4" />
                Chat
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Skeleton className="h-6 w-40" />
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <div key={index}>
                          <Skeleton className="h-4 w-36 mb-1" />
                          <Skeleton className="h-5 w-48" />
                        </div>
                      ))}
                  </div>

                  <Separator />

                  <div>
                    <Skeleton className="h-6 w-32 mb-3" />

                    <div className="space-y-4">
                      {Array(2)
                        .fill(0)
                        .map((_, index) => (
                          <div key={index} className="p-4 rounded-lg border">
                            <div className="flex items-start">
                              <Skeleton className="h-5 w-5 rounded-full" />

                              <div className="ml-3 w-full">
                                <Skeleton className="h-5 w-36 mb-2" />
                                <Skeleton className="h-4 w-full max-w-md mb-2" />
                                <Skeleton className="h-4 w-3/4 max-w-md mb-2" />
                                <Skeleton className="h-3 w-24 mt-2" />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">
                <Skeleton className="h-5 w-32" />
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              <div className="space-y-6">
                <div className="rounded-md p-4 border">
                  <div className="flex">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div className="ml-3 w-full">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>

                <div>
                  <Skeleton className="h-5 w-24 mb-2" />

                  <ol className="relative border-l border-gray-200 ml-3 space-y-6">
                    {Array(3)
                      .fill(0)
                      .map((_, index) => (
                        <li key={index} className="mb-6 ml-6">
                          <Skeleton className="absolute w-6 h-6 rounded-full -left-3" />
                          <Skeleton className="h-4 w-36 mb-1" />
                          <Skeleton className="h-3 w-24 mb-2" />
                          <Skeleton className="h-4 w-full max-w-md" />
                        </li>
                      ))}
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">
                <Skeleton className="h-5 w-24" />
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Info className="h-4 w-4 mt-0.5 mr-2 text-blue-500 flex-shrink-0" />
                  <Skeleton className="h-4 w-full" />
                </div>

                <div className="flex items-start">
                  <Info className="h-4 w-4 mt-0.5 mr-2 text-blue-500 flex-shrink-0" />
                  <Skeleton className="h-4 w-full" />
                </div>

                <Skeleton className="h-9 w-full rounded-md mt-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
