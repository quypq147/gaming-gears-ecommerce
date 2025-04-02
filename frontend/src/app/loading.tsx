"use client";

import { Loader2 } from "lucide-react";
import { Skeleton } from "@/src/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col items-center space-y-4">
        {/* Loader Icon */}
        <Loader2 className="h-10 w-10 text-primary animate-spin" />

        {/* Loading Text */}
        <p className="text-gray-700 text-lg font-medium">Vui lòng chờ một chút</p>

        {/* Skeleton UI for Product Preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-36 w-36 rounded-lg" />
          <Skeleton className="h-36 w-36 rounded-lg" />
          <Skeleton className="h-36 w-36 rounded-lg" />
          <Skeleton className="h-36 w-36 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
