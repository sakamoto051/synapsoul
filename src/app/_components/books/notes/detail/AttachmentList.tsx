import type React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { Attachment } from "@prisma/client";

interface AttachmentListProps {
  attachments: Attachment[];
  onDownload: (attachmentId: number) => void;
  downloadingAttachmentId: number | null;
}

export const AttachmentList: React.FC<AttachmentListProps> = ({
  attachments,
  onDownload,
  downloadingAttachmentId,
}) => (
  <div>
    <h3 className="text-lg font-semibold mb-2 text-blue-200">添付ファイル:</h3>
    <ul>
      {attachments.map((attachment) => (
        <li key={attachment.id} className="flex items-center mb-2">
          <span className="mr-2 text-gray-300">{attachment.fileName}</span>
          <Button
            onClick={() => onDownload(attachment.id)}
            size="sm"
            variant="secondary"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={downloadingAttachmentId === attachment.id}
          >
            <Download className="h-4 w-4 mr-1" />
            {downloadingAttachmentId === attachment.id
              ? "ダウンロード中..."
              : "ダウンロード"}
          </Button>
        </li>
      ))}
    </ul>
  </div>
);
