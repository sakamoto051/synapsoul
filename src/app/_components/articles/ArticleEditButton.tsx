"use client";
import React from "react";
import Link from "next/link";
import type { Article } from "@prisma/client";
import { Button } from "~/components/ui/button";
import { Edit } from "lucide-react";
import useAuthStore from "~/store/useAuthStore";

interface ArticleEditButtonProps {
  article: Article & { user: { id: number } };
}

export default function ArticleEditButton({ article }: ArticleEditButtonProps) {
  const { user } = useAuthStore();

  return (
    <>
      {Number(user?.id) === article.user.id && (
        <Link href={`/articles/${article.id}/edit`} passHref>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 bg-blue-600 hover:bg-blue-500 hover:text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            編集
          </Button>
        </Link>
      )}
    </>
  );
}
