"use client";
import React from "react";
import type { Article } from "@prisma/client";
import { Button } from "~/components/ui/button";
import { Trash2 } from "lucide-react";
import useAuthStore from "~/store/useAuthStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";

interface ArticleDeleteButtonProps {
  article: Article & { user: { id: number } };
}

export default function ArticleDeleteButton({
  article,
}: ArticleDeleteButtonProps) {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const utils = api.useUtils();

  const deleteArticleMutation = api.article.delete.useMutation({
    onSuccess: () => {
      toast({ title: "記事が削除されました" });
      utils.article.getAll.refetch();
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    deleteArticleMutation.mutate({ id });
  };

  return (
    <>
      {Number(user?.id) === article.user.id && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              削除
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>記事を削除しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                この操作は取り消せません。本当にこの記事を削除しますか？
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDelete(article.id)}>
                削除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
