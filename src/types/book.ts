// src/types/book.ts
import type {
  Book as PrismaBook,
  BookAPI as PrismaBookAPI,
  BookStatus as PrismaBookStatus,
} from "@prisma/client";

export type Book = PrismaBook;
export type BookAPI = PrismaBookAPI;
export type BookStatus = PrismaBookStatus;

export type BookItem = BookAPI;

export type BookItemWrapper = {
  Item: BookItem;
};

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
};

export type BookWithDetails = BookItem & Book;
