// src/lib/bookApi.ts

import type { BookResponse, BookItem } from "~/types/book";

const API_ENDPOINT = process.env.NEXT_PUBLIC_RAKUTEN_BOOK_API_URL;

export async function fetchBookInfoFromAPI(
  isbn: string,
): Promise<BookItem | null> {
  try {
    const response = await fetch(`${API_ENDPOINT}&isbn=${isbn}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as BookResponse;
    if (data.Items && data.Items.length > 0 && data.Items[0]) {
      const item = data.Items[0].Item;
      return {
        isbn: item.isbn,
        affiliateUrl: item.affiliateUrl,
        author: item.author,
        authorKana: item.authorKana,
        availability: item.availability,
        booksGenreId: item.booksGenreId,
        chirayomiUrl: item.chirayomiUrl,
        contents: item.contents,
        discountPrice: item.discountPrice,
        discountRate: item.discountRate,
        itemCaption: item.itemCaption,
        itemPrice: item.itemPrice,
        itemUrl: item.itemUrl,
        largeImageUrl: item.largeImageUrl,
        limitedFlag: item.limitedFlag,
        listPrice: item.listPrice,
        mediumImageUrl: item.mediumImageUrl,
        postageFlag: item.postageFlag,
        publisherName: item.publisherName,
        reviewAverage: item.reviewAverage,
        reviewCount: item.reviewCount,
        salesDate: item.salesDate,
        seriesName: item.seriesName,
        seriesNameKana: item.seriesNameKana,
        size: item.size,
        smallImageUrl: item.smallImageUrl,
        subTitle: item.subTitle,
        subTitleKana: item.subTitleKana,
        title: item.title,
        titleKana: item.titleKana,
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching book info for ISBN ${isbn}:`, error);
    return null;
  }
}
