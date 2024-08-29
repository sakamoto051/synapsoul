"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Save, ArrowLeft } from "lucide-react";

const EditNotePage = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const isbn = params.isbn as string;
  const noteId = Number(params.noteId);

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");

  const { data: note, isLoading } = api.note.getById.useQuery({ id: noteId });

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  const utils = api.useContext();

  const updateNoteMutation = api.note.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Note updated",
        description: "Your note has been successfully updated.",
      });
      // Invalidate the getByIsbn query to refresh the notes list
      utils.book.getByIsbn.invalidate({ isbn });
      // Navigate back to the notes list
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateNoteMutation.mutate({ id: noteId, title, content });
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
            <div className="flex justify-between">
              <Button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-700 text-white hover:bg-gray-600"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                戻る
              </Button>
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditNotePage;
