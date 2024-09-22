// src/types/importJob.ts
export interface ImportJobStatus {
  status: "started" | "processing" | "completed" | "failed";
  progress: number;
  result?: ImportJobResult;
  error?: string;
}

export interface ImportJobResult {
  processedBooks: number;
  successfulImports: number;
  failedImports: number;
}
