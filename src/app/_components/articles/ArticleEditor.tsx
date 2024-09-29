import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Textarea } from "~/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import "github-markdown-css/github-markdown.css";
import Link from "next/link";
import { HelpCircle } from "lucide-react";

interface ArticleEditorProps {
  content: string;
  setContent: (content: string) => void;
}

export default function ArticleEditor({
  content,
  setContent,
}: ArticleEditorProps) {
  return (
    <Tabs defaultValue="write" className="w-full">
      <div className="flex items-center space-x-2">
        <TabsList>
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <Link
          href="https://www.markdownguide.org/basic-syntax/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex items-center">
            <HelpCircle className="w-4 h-4 mr-1" />
            Markdown記法
          </div>
        </Link>
      </div>
      <TabsContent value="write">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[400px] w-full"
          placeholder="記事の内容をMarkdown形式で入力してください..."
        />
      </TabsContent>
      <TabsContent value="preview">
        <div className="markdown-body p-4 border rounded-md bg-white dark:bg-gray-800">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {content}
          </ReactMarkdown>
        </div>
      </TabsContent>
    </Tabs>
  );
}
