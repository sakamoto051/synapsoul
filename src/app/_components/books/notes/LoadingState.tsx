// src/components/LoadingState.tsx
import type React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingState: React.FC = () => (
  <Card className="w-full max-w-3xl mx-auto bg-gray-800 text-gray-100 shadow-lg border-none">
    <CardHeader>
      <Skeleton className="h-8 w-3/4 bg-gray-700" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-24 w-full bg-gray-700 mb-4" />
      <Skeleton className="h-24 w-full bg-gray-700 mb-4" />
      <Skeleton className="h-24 w-full bg-gray-700" />
    </CardContent>
  </Card>
);
