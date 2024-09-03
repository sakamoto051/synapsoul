"use server";
import React from "react";
import { list } from "@vercel/blob";
import Link from "next/link";
import { api } from "~/trpc/server";
import { Download } from "lucide-react";

export default async function AttachmentList({ noteId }: { noteId: number }) {
  const note = await api.note.getById({ id: noteId });

  if (!note) {
    return <div>メモが見つかりません</div>;
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  // noteのattachmentsに含まれるfilePathのリストを作成
  const notePaths = note.attachments.map((attachment) => attachment.filePath);

  // Blobストレージの全ファイルをリスト
  const response = await list();

  // noteに関連するBlobだけをフィルタリング
  const noteBlobs = response.blobs.filter((blob) =>
    notePaths.includes(blob.url),
  );

  return (
    <>
      {noteBlobs.length > 0 && (
        <div className="mt-6">
          <h4 className="text-xl font-semibold mb-4">添付ファイル</h4>
          <div className="space-y-2">
            {noteBlobs.map((blob) => (
              <div
                key={blob.url}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center overflow-hidden">
                  <Download className="h-5 w-5 mr-3 text-blue-400 flex-shrink-0" />
                  <Link
                    href={blob.url}
                    className="text-blue-400 hover:text-blue-300 hover:underline truncate"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {blob.pathname}
                  </Link>
                </div>
                <span className="text-xs text-gray-400 ml-4 flex-shrink-0">
                  {formatFileSize(blob.size)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
