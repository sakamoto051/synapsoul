import { Book } from '@prisma/client';

export type BookItem = {
  affiliateUrl: string;
  author: string;
  authorKana: string;
  availability: string;
  booksGenreId: string;
  chirayomiUrl: string;
  contents: string;
  discountPrice: number;
  discountRate: number;
  isbn: string;
  itemCaption: string;
  itemPrice: number;
  itemUrl: string;
  largeImageUrl: string;
  limitedFlag: number;
  listPrice: number;
  mediumImageUrl: string;
  postageFlag: number;
  publisherName: string;
  reviewAverage: string;
  reviewCount: number;
  salesDate: string;
  seriesName: string;
  seriesNameKana: string;
  size: string;
  smallImageUrl: string;
  subTitle: string;
  subTitleKana: string;
  title: string;
  titleKana: string;
}

export type BookItemWrapper = {
  Item: BookItem;
}

export type Items = BookItemWrapper[];

export type BookResponse = {
  GenreInformation: [];
  Items: Items;
  carrier: number;
  count: number;
  first: number;
  hits: number;
  last: number;
  page: number;
  pageCount: number;
}

export type BookWithDetails = BookItem & Book;