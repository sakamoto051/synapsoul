// types/bookMeter.ts

export interface ExternalBookStore {
  id: number;
  alphabet_name: string;
  official_name: string;
  ga_action: string;
  book_id: number;
  priority: number;
  url: string;
  image_path: string;
  created_at: string;
  updated_at: string;
}

export interface ExternalBookStoresResponse {
  resources: ExternalBookStore[];
}

export interface ImportBooksResult {
  totalBooks: number;
  processedBooks: number;
  successfulImports: number;
  failedImports: number;
}
