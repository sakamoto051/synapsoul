"use client";
import { api } from "~/trpc/react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useToast } from "~/components/ui/use-toast";

export function FeedbackList() {
  const { data: session } = useSession();
  const {
    data: feedbacks,
    isLoading,
    refetch,
  } = api.feedback.getAll.useQuery();
  const { toast } = useToast();

  const deleteFeedback = api.feedback.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast({ title: "フィードバックを削除しました" });
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  console.log(session?.user.id);
  console.log(feedbacks);

  if (isLoading) return <div>読み込み中...</div>;

  return (
    <div className="space-y-4">
      {feedbacks?.map((feedback) => (
        <Card key={feedback.id}>
          <div className="flex justify-between mx-2">
            <div className="m-4">
              <p>{feedback.content}</p>
              <p className="text-sm text-gray-500">
                {new Date(feedback.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center">
              {Number(session?.user.id) === Number(feedback.userId) && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-2"
                  onClick={() => deleteFeedback.mutate({ id: feedback.id })}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  削除
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
