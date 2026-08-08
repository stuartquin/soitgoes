import {
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export const getDate = (date: Date | string | undefined | null) => {
  if (!date) {
    return new Date();
  }
  return date instanceof Date ? date : new Date(date);
};

export const getStartOfWeek = (date: Date | string | undefined) => {
  return startOfWeek(getDate(date), { weekStartsOn: 1 });
};

export const getEndOfWeek = (date: Date | string | undefined) => {
  return endOfWeek(getDate(date), { weekStartsOn: 1 });
};

export const getStartOfMonth = (date: Date | string | undefined) => {
  return startOfMonth(getDate(date));
};

export const getEndOfMonth = (date: Date | string | undefined) => {
  return endOfMonth(getDate(date));
};

export const formatQuery = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

export const getTimeSlipQueryRange = (
  date: Date | string | undefined
): [string, string] => {
  const startDate = addWeeks(getStartOfWeek(date), -1);
  return [formatQuery(startDate), formatQuery(addWeeks(getEndOfWeek(date), 1))];
};

/** Format a date/string as the value for an `<input type="datetime-local">`. */
export const toDatetimeLocal = (
  date: Date | string | undefined | null
): string => {
  if (!date) return "";
  return format(getDate(date), "yyyy-MM-dd'T'HH:mm");
};

/** Parse a `datetime-local` input value into an ISO string (or null if empty). */
export const fromDatetimeLocal = (
  value: string | undefined | null
): string | null => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

export const formatAbbreviated = (
  date: Date | string | undefined | null
): string => {
  return format(getDate(date), "EEE, d MMM yyyy");
};
