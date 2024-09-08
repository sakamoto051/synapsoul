// src/types/importJob.ts

export interface ImportJobStatus {
  status: "started" | "processing" | "completed" | "failed";
  progress: number;
  result: {
    processedBooks: number;
    successfulImports: number;
    failedImports: number;
  };
  error?: string;
}

export interface ImportJobResult {
  processedBooks: number;
  successfulImports: number;
  failedImports: number;
}
