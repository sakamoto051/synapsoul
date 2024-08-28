import { format, toZonedTime } from "date-fns-tz";

const TIME_ZONE = "Asia/Tokyo";

export function formatDateInJST(
  date: Date,
  dateFormat: string = "yyyy-MM-dd HH:mm",
): string {
  const zonedDate = toZonedTime(date, TIME_ZONE);
  return format(zonedDate, dateFormat, { timeZone: TIME_ZONE });
}
