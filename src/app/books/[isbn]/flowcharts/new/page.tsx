import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Save } from "lucide-react";
import { api } from "~/trpc/react";
import { useToast } from "@/components/ui/use-toast";

const NewFlowchartPage = () => {
  const [title, setTitle] = useState("");
  const router = useRouter();
  const params = useParams();
  const isbn = params.isbn as string;
  const { toast } = useToast();

  const createFlowchartMutation = api.flowchart.create.useMutation({
    onSuccess: (data) => {
      toast({
        title: "フローチャート作成成功",
        description: "新しいフローチャートが作成されました。",
      });
      router.push(`/books/${isbn}/flowcharts/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: "フローチャートの作成に失敗しました。",
        variant: "destructive",
      });
      console.error("Error creating flowchart:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({
        title: "エラー",
        description: "タイトルを入力してください。",
        variant: "destructive",
      });
      return;
    }
    createFlowchartMutation.mutate({ title, isbn });
  };

  const isLoading = createFlowchartMutation.status === "pending";

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto bg-gray-800 text-gray-100 shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-300">
            新しいフローチャート
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-300">
                タイトル
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-700 text-white border-gray-600"
                placeholder="フローチャートのタイトルを入力"
              />
            </div>
            <div className="flex justify-between">
              <Button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-700 text-white hover:bg-gray-600"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                戻る
              </Button>
              <Button
                type="submit"
                className="bg-green-600 text-white hover:bg-green-700"
                disabled={isLoading}
              >
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "作成中..." : "作成"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewFlowchartPage;
