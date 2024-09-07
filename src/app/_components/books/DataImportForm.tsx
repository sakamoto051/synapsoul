"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { api } from "~/trpc/react";

export default function DataImportForm() {
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const importBooksMutation = api.book.importBooks.useMutation({
    onSuccess: (data) => {
      toast({
        title: "成功",
        description: `${data.processedBooks}冊の書籍データをインポートしました。`,
      });
      setIsLoading(false);
      setProgress(100);
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: `インポート中にエラーが発生しました: ${error.message}`,
        variant: "destructive",
      });
      setIsLoading(false);
    },
  });

  const handleImport = async () => {
    if (!userId) {
      toast({
        title: "エラー",
        description: "ユーザーIDを入力してください。",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);

    // WebSocketやServer-Sent Eventsを使用して進捗を受け取る
    // ここでは簡単のため、setIntervalを使用してシミュレート
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 100);

    try {
      await importBooksMutation.mutateAsync({ userId });
    } finally {
      clearInterval(progressInterval);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="読書メーターのユーザーID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        disabled={isLoading}
      />
      <Button onClick={handleImport} disabled={isLoading} className="w-full">
        {isLoading ? "インポート中..." : "インポート開始"}
      </Button>
      {isLoading && <Progress value={progress} className="w-full" />}
    </div>
  );
}
