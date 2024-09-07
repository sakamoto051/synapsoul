"use client";
import { api } from "~/trpc/react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useToast } from "~/components/ui/use-toast";

export function FeedbackList() {
  const { data: session } = useSession();
  const { data: feedbacks, refetch } = api.feedback.getAll.useQuery();
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

  const addReaction = api.feedback.addReaction.useMutation({
    onSuccess: () => refetch(),
    onError: (error) => {
      toast({
        title: "エラー",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeReaction = api.feedback.removeReaction.useMutation({
    onSuccess: () => refetch(),
    onError: (error) => {
      toast({
        title: "エラー",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleReaction = (feedbackId: number, type: "LIKE" | "DISLIKE") => {
    if (!session) {
      toast({
        title: "エラー",
        description: "リアクションするにはログインが必要です。",
        variant: "destructive",
      });
      return;
    }

    const existingReaction = feedbacks
      ?.find((f) => f.id === feedbackId)
      ?.feedbackReactions.find((r) => r.userId === Number(session.user.id));

    if (existingReaction && existingReaction.type === type) {
      removeReaction.mutate({ feedbackId });
    } else {
      addReaction.mutate({ feedbackId, type });
    }
  };

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
              <div className="flex mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction(feedback.id, "LIKE")}
                  className={
                    feedback?.feedbackReactions.some(
                      (r) =>
                        r.userId === Number(session?.user.id) &&
                        r.type === "LIKE",
                    )
                      ? "text-blue-500"
                      : ""
                  }
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  {
                    feedback?.feedbackReactions.filter((r) => r.type === "LIKE")
                      .length
                  }
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction(feedback.id, "DISLIKE")}
                  className={
                    feedback?.feedbackReactions.some(
                      (r) =>
                        r.userId === Number(session?.user.id) &&
                        r.type === "DISLIKE",
                    )
                      ? "text-red-500"
                      : ""
                  }
                >
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  {
                    feedback?.feedbackReactions.filter(
                      (r) => r.type === "DISLIKE",
                    ).length
                  }
                </Button>
              </div>
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
