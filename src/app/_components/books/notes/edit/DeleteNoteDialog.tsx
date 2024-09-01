// src/app/_components/books/notes/edit/DeleteNoteDialog.tsx
import type React from "react";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteNoteDialogProps {
  onDelete: () => void;
}

export const DeleteNoteDialog: React.FC<DeleteNoteDialogProps> = ({
  onDelete,
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button type="button" className="bg-red-600 text-white hover:bg-red-700">
        <Trash2 className="mr-2 h-4 w-4" />
        削除
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>本当にこのノートを削除しますか？</AlertDialogTitle>
        <AlertDialogDescription>
          この操作は取り消せません。ノートと関連するすべての添付ファイルが完全に削除されます。
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>キャンセル</AlertDialogCancel>
        <AlertDialogAction onClick={onDelete}>削除</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
