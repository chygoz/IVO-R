"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, MessageSquare } from "lucide-react";

export function ChatTabSkeleton() {
  return (
    <Card className="h-[calc(100vh-240px)] flex flex-col">
      <CardHeader className="px-6 py-4 border-b">
        <CardTitle className="text-lg">
          <Skeleton className="h-6 w-36" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64" />
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className={`flex ${
                  index % 2 === 0 ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-md rounded-lg p-4 ${
                    index % 2 === 0 ? "bg-gray-100 mr-12" : "bg-primary ml-12"
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <Skeleton
                      className={`h-5 w-24 ${
                        index % 2 === 1
                          ? "bg-primary-foreground/30"
                          : "bg-gray-200"
                      }`}
                    />
                  </div>

                  <Skeleton
                    className={`h-4 w-full mb-1 ${
                      index % 2 === 1
                        ? "bg-primary-foreground/30"
                        : "bg-gray-200"
                    }`}
                  />
                  <Skeleton
                    className={`h-4 w-3/4 mb-1 ${
                      index % 2 === 1
                        ? "bg-primary-foreground/30"
                        : "bg-gray-200"
                    }`}
                  />
                  <Skeleton
                    className={`h-4 w-1/2 ${
                      index % 2 === 1
                        ? "bg-primary-foreground/30"
                        : "bg-gray-200"
                    }`}
                  />

                  <Skeleton
                    className={`h-3 w-20 mt-2 ${
                      index % 2 === 1
                        ? "bg-primary-foreground/30"
                        : "bg-gray-200"
                    }`}
                  />
                </div>
              </div>
            ))}

          {/* Empty state skeleton */}
          <div className="hidden">
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400" />
              <Skeleton className="h-6 w-36 mx-auto mt-4" />
              <Skeleton className="h-4 w-64 mx-auto mt-2" />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 border-t mt-auto">
        <div className="w-full flex items-center gap-2">
          <Input
            placeholder="Type your message..."
            className="flex-1"
            disabled
          />
          <Button disabled>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
