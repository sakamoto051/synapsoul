import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { BookItem, BookItemWrapper, BookResponse } from "~/types/book";

const BASE_API_ENDPOINT = process.env.NEXT_PUBLIC_RAKUTEN_BOOK_API_URL;

export const booksGenreId = {
  "001004008": "日本の小説",
  "001004009": "外国の小説",
  "001004001": "ミステリー・サスペンス",
  "001004002": "SF・ホラー",
  "001004003": "エッセイ",
  "001004004": "ノンフィクション",
  "001004016": "ロマンス",
  "001004015": "その他",
  "001017005": "少年",
  "001017006": "少女",
  "001017004": "その他",
  "001021001": "小説",
  "001021002": "コミック",
  "001021003": "その他",
  "001029001": "小説",
  "001029002": "コミック",
  "001019001": "小説・エッセイ",
  "001019002": "美容・暮らし・健康・料理",
  "001019003": "ホビー・スポーツ・美術",
  "001019005": "語学・学習参考書",
  "001019006": "旅行・留学・アウトドア",
  "001019007": "人文・思想・社会",
  "001019008": "ビジネス・経済・就職",
  "001019009": "パソコン・システム開発",
  "001019010": "科学・医学・技術",
  "001019011": "漫画（コミック）",
  "001019012": "ライトノベル",
  "001019013": "エンタメ",
  "001019014": "写真集・タレント",
  "001019015": "その他",
  "001020001": "小説・エッセイ",
  "001020002": "美容・暮らし・健康・料理",
  "001020003": "ホビー・スポーツ・美術",
  "001020004": "絵本・児童書・図鑑",
  "001020005": "語学・学習参考書",
  "001020006": "旅行・留学・アウトドア",
  "001020007": "人文・思想・社会",
  "001020008": "ビジネス・経済・就職",
  "001020009": "パソコン・システム開発",
  "001020010": "科学・医学・技術",
  "001020011": "エンタメ",
  "001020014": "その他",
  "001010001": "恋愛",
  "001010002": "妊娠・出産・子育て",
  "001010003": "ペット",
  "001010004": "住まい・インテリア",
  "001010005": "ガーデニング・フラワー",
  "001010006": "生活の知識",
  "001010008": "冠婚葬祭・マナー",
  "001010009": "手芸",
  "001010010": "健康",
  "001010011": "料理",
  "001010012": "ドリンク・お酒",
  "001010013": "生き方・リラクゼーション",
  "001010007": "占い",
  "001010014": "ファッション・美容",
  "001010016": "雑貨",
  "001010015": "その他",
};

export const useBookSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [books, setBooks] = useState<BookItem[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("title") ?? "");
  const [authorInput, setAuthorInput] = useState(
    searchParams.get("author") ?? "",
  );
  const [publisherInput, setPublisherInput] = useState(
    searchParams.get("publisherName") ?? "",
  );
  const [genreInput, setGenreInput] = useState(
    searchParams.get("booksGenreId") ?? "",
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page") ?? 1),
  );
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const updateUrlParams = useCallback(
    (
      title: string,
      author: string,
      publisher: string,
      genre: string,
      page: number,
    ) => {
      const params = new URLSearchParams(searchParams.toString());
      if (title) params.set("title", title);
      if (author) params.set("author", author);
      if (publisher) params.set("publisherName", publisher);
      if (genre) params.set("booksGenreId", genre);
      params.set("page", String(page));
      router.push(`/books/search?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  const fetchBooks = useCallback(
    async (
      page: number,
      title: string,
      author: string,
      publisher: string,
      genre: string,
    ) => {
      setIsLoading(true);
      try {
        let apiUrl = `${BASE_API_ENDPOINT}&page=${page}`;
        if (title) apiUrl += `&title=${encodeURIComponent(title)}`;
        if (author) apiUrl += `&author=${encodeURIComponent(author)}`;
        if (publisher)
          apiUrl += `&publisherName=${encodeURIComponent(publisher)}`;
        if (genre) apiUrl += `&booksGenreId=${encodeURIComponent(genre)}`;

        console.log("Fetching books with URL:", apiUrl); // デバッグ用ログ

        const response = await fetch(apiUrl);
        const data: BookResponse = (await response.json()) as BookResponse;

        console.log("API Response:", data); // デバッグ用ログ

        setBooks(data.Items.map((item: BookItemWrapper) => item.Item));
        setTotalPages(data.pageCount || 1);
        setTotalCount(data.count || 0);
        setCurrentPage(page);
        updateUrlParams(title, author, publisher, genre, page);
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([]);
        setTotalPages(1);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [updateUrlParams],
  );

  useEffect(() => {
    fetchBooks(
      currentPage,
      searchTerm,
      authorInput,
      publisherInput,
      genreInput,
    );
  }, [
    fetchBooks,
    currentPage,
    searchTerm,
    authorInput,
    publisherInput,
    genreInput,
  ]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      if (e) {
        e.preventDefault();
      }
      fetchBooks(1, searchTerm, authorInput, publisherInput, genreInput);
    },
    [fetchBooks, searchTerm, authorInput, publisherInput, genreInput],
  );

  return {
    books,
    searchTerm,
    setSearchTerm,
    authorInput,
    setAuthorInput,
    publisherInput,
    setPublisherInput,
    genreInput,
    setGenreInput,
    currentPage,
    totalPages,
    totalCount,
    handlePageChange,
    handleSearch,
    isLoading,
  };
};

export default useBookSearch;
