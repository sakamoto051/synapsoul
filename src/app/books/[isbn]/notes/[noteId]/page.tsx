"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  Save,
  ArrowLeft,
  Trash2,
  Paperclip,
  X,
  Download,
} from "lucide-react";
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

interface Attachment {
  id: number;
  fileName: string;
  mimeType: string;
  filePath: string;
}

const EditNotePage = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const isbn = params.isbn as string;
  const noteId = Number(params.noteId);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [existingAttachments, setExistingAttachments] = useState<Attachment[]>(
    [],
  );
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [removedAttachmentIds, setRemovedAttachmentIds] = useState<number[]>(
    [],
  );

  const { data: note, isLoading } = api.note.getById.useQuery({ id: noteId });

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setExistingAttachments(note.attachments);
    }
  }, [note]);

  const utils = api.useContext();

  const updateNoteMutation = api.note.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Note updated",
        description: "Your note has been successfully updated.",
      });
      utils.book.getByIsbn.invalidate({ isbn });
      router.push(`/books/${isbn}/notes`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteNoteMutation = api.note.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Note deleted",
        description: "Your note has been successfully deleted.",
      });
      utils.book.getByIsbn.invalidate({ isbn });
      router.push(`/books/${isbn}/notes`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const attachmentsToUpload = await Promise.all(
      newAttachments.map(async (file) => {
        const fileContent = await fileToBase64(file);
        return {
          fileName: file.name,
          fileContent,
          mimeType: file.type,
        };
      }),
    );

    updateNoteMutation.mutate({
      id: noteId,
      title,
      content,
      attachments: attachmentsToUpload,
      removedAttachmentIds,
    });
  };

  const handleDelete = () => {
    deleteNoteMutation.mutate({ id: noteId });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewAttachments((prev) => [
        ...prev,
        ...Array.from(e.target.files || []),
      ]);
    }
  };

  const removeNewAttachment = (index: number) => {
    setNewAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = (id: number) => {
    setExistingAttachments((prev) =>
      prev.filter((attachment) => attachment.id !== id),
    );
    setRemovedAttachmentIds((prev) => [...prev, id]);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleDownload = (attachment: Attachment) => {
    const link = document.createElement("a");
    link.href = attachment.filePath;
    link.download = attachment.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto bg-gray-800 text-gray-100 shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-300">
            読書メモを編集
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300"
              >
                タイトル
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 bg-gray-700 text-white"
                required
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-300"
              >
                内容
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 bg-gray-700 text-white"
                rows={10}
                required
              />
            </div>
            <div>
              <label
                htmlFor="attachments"
                className="block text-sm font-medium text-gray-300"
              >
                添付ファイル
              </label>
              <div className="mt-1 flex items-center">
                <Input
                  id="attachments"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                <Button
                  type="button"
                  onClick={() =>
                    document.getElementById("attachments")?.click()
                  }
                  className="bg-gray-700 text-white hover:bg-gray-600"
                >
                  <Paperclip className="mr-2 h-4 w-4" />
                  ファイルを選択
                </Button>
              </div>
              <div className="mt-2 space-y-2">
                {existingAttachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between bg-gray-700 p-2 rounded"
                  >
                    <span className="text-sm text-gray-300">
                      {attachment.fileName}
                    </span>
                    <div>
                      <Button
                        type="button"
                        onClick={() => handleDownload(attachment)}
                        className="bg-blue-600 hover:bg-blue-700 p-1 mr-2"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        onClick={() => removeExistingAttachment(attachment.id)}
                        className="bg-red-600 hover:bg-red-700 p-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {newAttachments.map((file, index) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between bg-gray-700 p-2 rounded"
                  >
                    <span className="text-sm text-gray-300">{file.name}</span>
                    <Button
                      type="button"
                      onClick={() => removeNewAttachment(index)}
                      className="bg-red-600 hover:bg-red-700 p-1"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-700 text-white hover:bg-gray-600"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                戻る
              </Button>
              <div className="space-x-2">
                <AlertDialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      className="bg-red-600 text-white hover:bg-red-700"
                      disabled={deleteNoteMutation.isPending}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      削除
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                      <AlertDialogDescription>
                        この操作は取り消せません。本当にこのメモを削除してもよろしいですか？
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        削除
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button
                  type="submit"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  disabled={updateNoteMutation.isPending}
                >
                  {updateNoteMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  保存
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditNotePage;
