"use client";

// import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function CustomError({
  // error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // useEffect(() => {
  //   console.error(error);
  // }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold mb-4">エラーが発生しました</h2>
      <Button
        onClick={() => reset()}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        もう一度試す
      </Button>
    </div>
  );
}
