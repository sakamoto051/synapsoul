export interface BookItem {
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

export interface BookItemWrapper {
  Item: BookItem;
}

export type Items = BookItemWrapper[];

export interface BookResponse {
  Items: Items;
}