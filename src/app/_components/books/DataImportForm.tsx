"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { api } from "~/trpc/react";

export default function DataImportForm() {
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [jobId, setJobId] = useState<string | null>(null);
  const { toast } = useToast();

  const startImportMutation = api.book.startImportBooks.useMutation({
    onSuccess: (data) => {
      setJobId(data.jobId);
      setIsLoading(true);
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: `インポート開始時にエラーが発生しました: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const { data: importStatus } = api.book.getImportStatus.useQuery(
    { jobId: jobId ?? "" },
    { enabled: !!jobId, refetchInterval: 1000 },
  );

  useEffect(() => {
    if (importStatus) {
      if (importStatus.status === "processing") {
        setProgress(importStatus.progress);
      } else if (importStatus.status === "completed") {
        setIsLoading(false);
        setJobId(null);
        toast({
          title: "成功",
          description: `${importStatus.result.processedBooks}冊の書籍データをインポートしました。`,
        });
      } else if (importStatus.status === "failed") {
        setIsLoading(false);
        setJobId(null);
        toast({
          title: "エラー",
          description: `インポート中にエラーが発生しました: ${importStatus.error}`,
          variant: "destructive",
        });
      }
    }
  }, [importStatus, toast]);

  const handleImport = async () => {
    if (!userId) {
      toast({
        title: "エラー",
        description: "ユーザーIDを入力してください。",
        variant: "destructive",
      });
      return;
    }

    startImportMutation.mutate({ userId });
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
