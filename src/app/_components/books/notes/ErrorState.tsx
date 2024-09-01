// src/components/ErrorState.tsx
import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ErrorStateProps {
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => (
  <Card className="w-full max-w-3xl mx-auto bg-gray-800 text-gray-100 shadow-lg border-none">
    <CardContent className="text-center py-8">
      <Alert variant="destructive">
        <AlertDescription>
          読書メモの取得中にエラーが発生しました。
        </AlertDescription>
      </Alert>
      <Button onClick={onRetry} className="mt-4">
        <RefreshCw className="mr-2 h-4 w-4" />
        再試行
      </Button>
    </CardContent>
  </Card>
);
